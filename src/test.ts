import fse from 'fs-extra';
import { resolve } from 'path';

const resolvePath = (pathname: string) => resolve(process.cwd(), pathname);
// const pathname = path.resolve(process.cwd(), 'demo');
// console.log(pathname);
// const s = fse.ensureDirSync(pathname);
// console.log(s);
// fse.outputFileSync(path.resolve(process.cwd(), './demo.ts'), 'yy');
console.log(resolvePath('./demo/'));
fse.moveSync(resolvePath('./demo.ts'), resolvePath('./demo/demo.ts'));
