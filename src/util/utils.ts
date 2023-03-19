import path from 'path';
import execa from 'execa';

/**
 * @param fileName 文件名
 * @param base 目录
 * @returns string
 */
const resolve = (fileName: string, base = process.cwd()) =>
  path.resolve(base, fileName);

/**
 * 判断项目是否初始化了git
 * @param cwd string
 * @returns boolean
 */
function hasProjectGit(cwd: string = process.cwd()) {
  try {
    execa.sync('git', ['status'], { cwd }); // 不输出执行结果，所以不设置stdio
    return true;
  } catch (error) {
    return false;
  }
}

export { resolve, hasProjectGit };
