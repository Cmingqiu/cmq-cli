import { defaults, vuePresets, VuePresetsItem } from './util/preset';
import inquirer, {
  Answers,
  ListQuestion,
  CheckboxQuestion,
  ConfirmQuestion,
  InputQuestion
} from 'inquirer';
import { MANUALVALUE } from './util/const';
import PromptModuleAPI from './PromptModuleAPI';
import getPromptModules from './util/prompt';
import chalk from 'chalk';
import PackageManager from './PackageManager';
import { PkgType } from './types';
import writeFileTree from './util/writeFileTree';
import executeCommand from './util/executeCommand';
import { hasProjectGit } from './util/utils';

/**
 * @params name 项目名称
 */
class Creator {
  presetPrompt: ListQuestion;
  featurePrompt: CheckboxQuestion;
  outputPrompts: (ListQuestion | InputQuestion | ConfirmQuestion)[];
  // 给已有选项的补充
  injectedPrompts: Array<ListQuestion | ConfirmQuestion> = [];
  // 回调
  promptCompleteCbs: any[] = [];
  // 包管理工具类
  pm!: PackageManager;
  pkg!: PkgType;

  constructor(private name: string, public context: string) {
    this.presetPrompt = this.resolvePresetPrompts();
    this.featurePrompt = this.resolveFeaturePrompts();
    this.outputPrompts = this.resolveOutputPrompts();

    /* 注入choices */
    const promptAPI = new PromptModuleAPI(this);
    getPromptModules().then(moduleFns => {
      moduleFns.forEach(module => module.default(promptAPI));
      this.create();
    });
  }
  async create() {
    const preset = await this.promptAndResolvePreset();
    console.log(preset);
    this.initPackageManageEnv(preset);
  }
  // 预设提示选项
  resolvePresetPrompts() {
    const presetChoices = Object.entries(defaults.presets).map(
      ([name, preset]) => ({
        name: `${name}(${Object.keys(preset.plugins).join(',')})`,
        value: name
      })
    );
    return {
      type: 'list' as const, // list 表单选
      name: 'preset', // preset 记录用户选择的选项值。
      message: `Please pick a preset:`,
      choices: [
        ...presetChoices, // Vue2 默认配置，Vue3 默认配置
        {
          name: 'Manually select features', // 手动选择配置，自定义特性配置
          value: '__manual__'
        }
      ]
    };
  }
  // 自定义特性复选框
  resolveFeaturePrompts() {
    return {
      type: 'checkbox' as const,
      name: 'feature',
      message: 'Check the features needed for your project:',
      choices: [], //待注入
      when: (answer: Answers) => answer.preset === MANUALVALUE,
      pageSize: 10
    };
  }
  // 输出方式
  resolveOutputPrompts() {
    return [
      {
        type: 'list' as const,
        name: 'useConfigFiles',
        message: 'Where do you prefer placing config for Babel, ESLint, etc.?',
        when: (answer: Answers) => answer.preset === MANUALVALUE,
        choices: [
          {
            name: 'In dedicated config files',
            value: 'files'
          },
          {
            name: 'In package.json',
            value: 'pkg'
          }
        ]
      },
      {
        type: 'confirm' as const,
        when: (answer: Answers) => answer.preset === MANUALVALUE,
        name: 'save',
        message: 'Save this as a preset for future projects?',
        default: false
      },
      {
        type: 'input' as const,
        name: 'saveName',
        when: (answer: Answers) => !!answer.save,
        message: 'Save preset as:'
      }
    ];
  }
  // 汇总所有选项
  resolveFinalPrompts() {
    return [
      this.presetPrompt,
      this.featurePrompt,
      ...this.outputPrompts,
      ...this.injectedPrompts
    ];
  }

  async promptAndResolvePreset() {
    try {
      let preset: VuePresetsItem;
      const answers = await inquirer.prompt(this.resolveFinalPrompts());
      console.log(answers);

      if (answers.preset === 'Default (Vue 2)') {
        preset = vuePresets['Default (Vue 2)'];
      } else {
        throw new Error('哎呀，出错了，暂不支持 Vue3、自定义特性配置情况');
      }

      preset.plugins['@vue/cli-service'] = {
        projectName: this.name,
        ...preset
      };

      return preset;
    } catch (error) {
      console.log(chalk.red(error));
      process.exit(1);
    }
  }
  // 初始化安装环境，安装内置插件
  async initPackageManageEnv(preset: VuePresetsItem) {
    const { name, context } = this;
    this.pm = new PackageManager({ context });
    console.log(`✨ 创建项目：${chalk.yellow(context)}`);
    const pkg: PkgType = {
      name,
      version: '1.0.0',
      private: true,
      devDependencies: {}
    };
    // 给依赖devDependencies指定版本
    Object.keys(preset.plugins).forEach((pluginKey: string) => {
      let version = preset.plugins[pluginKey].version;
      if (!version) version = 'latest';
      pkg.devDependencies[pluginKey] = version;
    });
    this.pkg = pkg;
    // 写入package.json文件
    writeFileTree(context, {
      'package.json': JSON.stringify(this.pkg, null, 2)
    });
    // 初始化git，以至于 vue-cli-service 可以设置 git hooks
    if (this.shouldInitGit()) {
      console.log(`🗃 初始化 Git 仓库...`);
      await executeCommand('git', ['init'], context);
    }
    console.log(`⚙ 正在安装 CLI plugins. 请稍候...`);
    await this.pm.install();
  }

  // 判断是否可以初始化 git 仓库：系统安装了 git 且目录下未初始化过，则初始化
  shouldInitGit() {
    /* 
    if (!hasGit()) {
      // 系统未安装 git
      return false
    }
    */
    return !hasProjectGit(this.context);
  }
}

export default Creator;
