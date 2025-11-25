// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'], // 继承默认规则
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w+)(?:\((.*)\))?:(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    }
  },
  rules: {
    // 自定义规则
    'type-enum': [
      2, // 错误级别：0=禁用，1=警告，2=错误
      'always', // 条件：always|never
      [
        // 自定义 type 类型
        'feat', //新功能
        'fix',  //修复bug
        'docs',  //文档更新
        'style',  //样式优化（无功能变化）
        'refactor',  //（代码重构）（无功能变化）
        'perf',  //性能优化（无功能变化）
        'test',  //测试更新
        'chore',  //构建/工具更新
        'revert',  //回滚提交
        'build',  //打包发布
        'init',  //初始化
        'wip', //工作进行中
        'release' // 版本发布
      ]
    ],
    'type-case': [2, 'always', 'lower-case'], // type 必须小写
    'type-empty': [2, 'never'], // type 不能为空
    'scope-case': [0], // 不强制 scope 大小写
    'subject-full-stop': [0, 'never'], // 不强制在 subject 末尾加句号
    'subject-case': [0, 'never'], // 不强制 subject 大小写
    'header-max-length': [2, 'always', 72], // header 最大长度 72
    'body-leading-blank': [1, 'always'], // body 前必须空一行
    'footer-leading-blank': [1, 'always'] // footer 前必须空一行
  },
  // 自定义错误信息
  prompt: {
    messages: {
      type: '选择提交类型:',
      scope: '选择修改范围 (可选):',
      subject: '简短描述 (小写开头，无句号):',
      body: '详细描述 (可选，按回车跳过):',
      breaking: '破坏性变更说明 (可选，按回车跳过):',
      footer: '关联的 issue 或关闭标记 (可选，按回车跳过):',
      confirmCommit: '确认以上提交信息?'
    }
  }
};