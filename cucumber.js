module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'src/support/world.ts',
      'src/hooks/hooks.ts',
      'src/features/step_definitions/**/*.ts',
    ],
    paths: ['src/features/**/*.feature'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
    ],
    timeout: 60000,
  },
};
