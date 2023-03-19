import execa from 'execa';

/**
 * 执行命令
 * @param command 命令行
 * @param args 参数
 * @param cwd 运行目录
 * @returns Promise
 */
export default function (command: string, args: string[], cwd = '') {
  return new Promise((resolve, reject) => {
    const child = execa(command, args, {
      cwd,
      stdio: ['inherit', 'inherit', 'inherit']
    });
    child.on('close', code => {
      if (code != 0) {
        reject(new Error(`command failed: ${command} ${args.join(' ')}`));
        return;
      }
      resolve(true);
    });
  });
}
