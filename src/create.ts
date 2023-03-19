import { resolve } from './util/utils';
import Creator from './Creator';

function create(name: string, options: any) {
  console.log('创建项目的目录路径', resolve(name));
  new Creator(name, resolve(name));
}

export default create;
