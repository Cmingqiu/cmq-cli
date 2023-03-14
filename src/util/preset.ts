import { Merge } from '../types';

// 预设了 babel 和 eslint
export const defaultPreset: DefaultPreset = {
  useConfigFiles: false,
  cssPreprocessor: undefined,
  plugins: {
    '@vue/cli-plugin-babel': {},
    '@vue/cli-plugin-eslint': {
      config: 'base',
      lintOn: ['save']
    }
  }
};

// vue2、vue3选项预设了 babel 和 eslint
export const vuePresets: VuePresets = {
  'Default (Vue 3)': Object.assign({ vueVersion: '3' }, defaultPreset),
  'Default (Vue 2)': Object.assign({ vueVersion: '2' }, defaultPreset)
};

export const defaults = {
  lastChecked: undefined,
  latestVersion: undefined,
  packageManager: undefined,
  useTaoBaoRegistry: undefined,
  presets: vuePresets
};

interface DefaultPreset {
  useConfigFiles: boolean;
  cssPreprocessor: undefined;
  plugins: {
    '@vue/cli-plugin-babel': Record<string, any>;
    '@vue/cli-plugin-eslint': {
      config: string;
      lintOn: string[];
    };
    '@vue/cli-service'?: any;
    [k: string]: any;
  };
}

type VuePresets = {
  'Default (Vue 3)': Merge<{ vueVersion: string }, DefaultPreset>;
  'Default (Vue 2)': Merge<{ vueVersion: string }, DefaultPreset>;
};
