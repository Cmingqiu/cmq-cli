import path from 'path';

const resolve = (p: string) => path.resolve(process.cwd(), p);

export { resolve };
