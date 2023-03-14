import { defaults, vuePresets } from './util/preset';
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
  constructor(private name: string) {
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
      let preset;
      const answers = await inquirer.prompt(this.resolveFinalPrompts());

      if (answers?.preset === 'Default (Vue 2)') {
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
}

export default Creator;
