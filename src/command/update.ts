import chalk from 'chalk';
import { exec } from 'child_process';
import { gt } from 'lodash';
import ora from 'ora';

import { log } from '@/utils';

import { name, version } from '../../package.json';

const spinner = ora({
  text: '更新中...',
  spinner: {
    interval: 100,
    frames: ['', '◐', '◓', '◑', '◒'].map((frame) => chalk.green(frame)),
  },
});

// 执行命令的 Promise 包装
const execPromise = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) reject(error);
      else resolve(stdout.trim());
    });
  });
};

const update = async () => {
  try {
    spinner.start('正在检查最新版本...');

    // 获取当前安装的版本
    const currentVersion = await execPromise(`npm list -g ${name} --json`)
      .then((output) => {
        try {
          const json = JSON.parse(output);
          return json.dependencies?.[name]?.version || version;
        } catch (e) {
          return version;
        }
      })
      .catch(() => version);

    // 获取所有可用版本
    const allVersions = await execPromise(`npm view ${name} versions --json`)
      .then((output) => {
        try {
          return JSON.parse(output);
        } catch (e) {
          return [];
        }
      })
      .catch(() => []);

    // 获取最新版本
    const latestVersion = allVersions.length > 0 ? allVersions[allVersions.length - 1] : null;

    if (!latestVersion) {
      spinner.fail('无法获取最新版本信息');
      log.warning('可能是网络问题或 npm 注册表暂时不可用，请稍后再试');
      return;
    }

    // 显示版本信息
    spinner.stop();
    log.info(`当前版本: ${currentVersion}`);
    log.info(`最新版本: ${latestVersion}`);

    // 比较当前版本和最新版本
    const isNewVersionAvailable = gt(latestVersion, currentVersion);

    // 如果已经是最新版本，则退出
    if (!isNewVersionAvailable) {
      log.info('当前已经是最新版本!');
      return;
    }

    // 询问用户是否要更新
    const { confirm } = await import('@inquirer/prompts');

    const shouldUpdate = await confirm({
      message: `是否更新到最新版本 ${latestVersion}？`,
      default: true,
    });

    if (!shouldUpdate) {
      log.warning('已取消更新！');
      return;
    }

    // 安装最新版本
    spinner.start(`正在更新到最新版本 ${latestVersion}...`);

    try {
      // 先清除缓存，然后安装
      await execPromise('npm cache clean --force');
      await execPromise(`npm install ${name}@${latestVersion} -g --force`);

      // 验证安装结果
      const newVersion = await execPromise(`npm list -g ${name} --json`)
        .then((output) => {
          try {
            const json = JSON.parse(output);
            return json.dependencies?.[name]?.version || null;
          } catch (e) {
            return null;
          }
        })
        .catch(() => null);

      spinner.stop();

      if (newVersion === latestVersion) {
        log.success(`更新成功！`);
        log.success(`已从 ${currentVersion} 更新到 ${latestVersion}`);
      } else {
        log.warning(`更新可能部分成功`);
        log.warning(`期望版本: ${latestVersion}`);
        log.warning(`当前版本: ${newVersion || '未知'}`);

        // 如果验证失败，尝试使用官方源
        log.info('尝试使用官方源进行安装...');
        spinner.start('使用官方源重新安装...');
        await execPromise(
          `npm install ${name}@${latestVersion} -g --force --registry=https://registry.npmjs.org/`,
        );
        spinner.stop();
        log.success('更新完成！');
        log.success(`已从 ${currentVersion} 更新到 ${latestVersion}`);
      }
    } catch (error) {
      // 如果安装失败，提供更多选项
      spinner.stop();
      log.error(`更新失败!`);
      log.error(String(error));
      log.warning(`您可以尝试以下方法手动更新:`);
      log.warning(`1. npm install ${name}@${latestVersion} -g --force`);
      log.warning(`2. npm cache clean --force && npm install ${name}@${latestVersion} -g`);
      log.warning(`3. 切换到官方源: npm config set registry https://registry.npmjs.org/ 然后重试`);
    }
  } catch (error) {
    spinner.stop();
    log.error(`更新过程中发生错误`);
    log.error(String(error));
    log.warning(`您可以尝试手动更新: npm install ${name}@latest -g --force`);
  }
};

export default update;
