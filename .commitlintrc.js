module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 增加新功能
        'fix', // 修复 bug
        'add', // 增加代码逻辑
        'del', // 删除功能
        'update', // 更新功能
        'docs', // 文档相关的改动
        'style', // 不影响代码逻辑的改动，例如修改空格，缩进等
        'build', // 构造工具或者相关依赖的改动
        'refactor', //  代码重构
        'revert', // 撤销，版本回退
        'test', // 添加或修改测试
        'perf', // 提高性能的改动
        'chore', // 修改 src 或者 test 的其余修改，例如构建过程或辅助工具的变动
        'ci' // CI 配置，脚本文件等改动
      ]
    ]
  }
};
