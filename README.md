## 使用 ts 搭建脚手架@cmq/cli

注意：

- chalk@1.2、inquirer@.2.5 版本号降低，才能使用 commonjs 规范

### 特性

- 规范化：集成了 eslint，prettier，husky，lint-staged，commitlint
- 预设配置 vue2 vue3 手动选择
- 手动选择 babel,router,vuex,vueVersion,i18n,axios
- vueVersion 选择：vue2 vue3
- router 选择：history 模式
- router 与 vuex 在 main.js 中导入并注入
