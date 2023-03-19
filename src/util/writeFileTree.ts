import fse from 'fs-extra';
import path from 'path';

/**
 * 创建文件
 * @param dir 文件目录路径
 * @param files 文件列表
 */
export default function (dir: string, files: Record<string, string>) {
  Object.keys(files).forEach(fileName => {
    const filePath = path.join(dir, fileName);
    fse.ensureDirSync(path.dirname(filePath));
    fse.outputFileSync(filePath, files[fileName]);
  });
}
