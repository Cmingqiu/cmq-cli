import PromptModuleAPI from '../PromptModuleAPI';
import { InjectFunction } from '../types';

/**
 * 动态导入插件
 */
function getPromptModules(): Promise<Array<InjectFunction<PromptModuleAPI>>> {
  const plugins = ['babel', 'router'];
  return Promise.all(plugins.map(p => import(`../promptModules/${p}`)));
}

export default getPromptModules;
