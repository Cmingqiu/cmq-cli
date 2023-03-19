// 注入函数类型
export interface InjectFunction<T> {
  default: (ins: T) => void;
}

// 类型相交
export type Inter<T extends object, K extends object> = Pick<
  T,
  Extract<keyof T, keyof K>
>;

// 类型合并
export type Merge<T extends object, K extends object> = Omit<
  T,
  keyof Inter<T, K>
> &
  K;

// package.json类型
export type PkgType = {
  name: string;
  version: string;
  private: boolean;
  devDependencies: Record<string, string>;
};
