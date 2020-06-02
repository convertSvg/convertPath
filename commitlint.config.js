module.exports = {
  extends: ['@commitlint/config-angular'],
  rules: {
    'header-max-length': [0, 'always', 72],
    'subject-empty': [1, 'always'],
  },
}
