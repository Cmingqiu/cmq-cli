/**
 * 包管理工具类
 */
import execa from 'execa';
import semver from 'semver';
import {
  MIN_SUPPORTED_NPM_VERSION,
  PACKAGE_MANAGER_CONFIG,
  PmConfigType
} from './util/const';
import executeCommand from './util/executeCommand';

class PackageManager {
  private bin = 'npm' as const;
  public context: string;
  public needsPeerDepsFix = false;
  constructor({ context } = { context: process.cwd() }) {
    // 当前npm版本号
    const npmVersion = execa.sync('npm', ['--version']).stdout;
    this.context = context;
    if (semver.lt(npmVersion, MIN_SUPPORTED_NPM_VERSION)) {
      throw new Error('NPM 版本太低啦，请升级');
    }
    if (semver.gte(npmVersion, '7.0.0')) this.needsPeerDepsFix = true;
  }

  async install() {
    const args: string[] = [];
    if (this.needsPeerDepsFix) {
      args.push('--legacy-peer-deps');
    }
    await this.runCommand('install', args);
  }

  async runCommand(
    action: keyof PmConfigType[keyof PmConfigType],
    args: string[]
  ) {
    await executeCommand(
      this.bin,
      [...PACKAGE_MANAGER_CONFIG[this.bin][action], ...args],
      this.context
    );
  }
}

export default PackageManager;
