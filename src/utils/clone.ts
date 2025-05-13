import chalk from 'chalk';
import createLogger from 'progress-estimator';
import simpleGit, { SimpleGitOptions } from 'simple-git';

import log from './log';

// 初始化进度条
const logger = createLogger({
  spinner: {
    interval: 100,
    frames: ['', '◐', '◓', '◑', '◒'].map((frame) => chalk.green(frame)),
  },
});

const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
};

const clone = async (gitUrl: string, projectName: string, options: string[]) => {
  const git = simpleGit(gitOptions);

  // 添加环境变量跳过 SSH 主机验证
  git.env('GIT_SSH_COMMAND', 'ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null');

  try {
    await logger(git.clone(gitUrl, projectName, options), '加载中...', {
      // 预计时间
      estimate: 7000,
    });
    log.success('加载完成！\n');
    console.log(chalk.green('可以执行以下命令开始项目：\n'));
    console.log(chalk.green(`cd ${projectName}\n`));
    console.log(chalk.green('pnpm i\n'));
    console.log(chalk.green('pnpm dev\n'));
  } catch (error) {
    log.error(`加载失败！\n${error}`);
  }
};

export default clone;
