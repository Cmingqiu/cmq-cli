// 自定义选项值
export const MANUALVALUE = '__manual__';

export const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: ['install', '--loglevel', 'error']
  }
};

export type PmConfigType = typeof PACKAGE_MANAGER_CONFIG;

// 最低npm版本号
export const MIN_SUPPORTED_NPM_VERSION = '6.9.0';
