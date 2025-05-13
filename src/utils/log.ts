import chalk from 'chalk';

const log = {
  success: (message: string) => {
    console.log(chalk.green(`✔ ${message}`));
  },
  info: (message: string) => {
    console.log(chalk.cyan(`ℹ ${message}`));
  },
  error: (message: string) => {
    console.log(chalk.red(`✗ ${message}`));
  },
  warning: (message: string) => {
    console.log(chalk.yellow(`⚠ ${message}`));
  },
};

export default log;
