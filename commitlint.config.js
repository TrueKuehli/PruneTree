module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'always', 'sentence-case'],
    'header-max-length': [0, 'never', null],
  },
};
