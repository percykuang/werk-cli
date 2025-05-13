import { input, select } from '@inquirer/prompts';

import fs from 'fs-extra';
import { gt } from 'lodash';
import path from 'path';
import 'tslib';

import { TemplateInfo, templates } from '@/config';
import { clone, getNpmLatestVersion, isOverwrite, log } from '@/utils';

import { name, version } from '../../package.json';

const checkVersion = async (name: string, version: string) => {
  const lastestVersion = await getNpmLatestVersion(name);
  const isLowVersion = gt(lastestVersion, version);
  if (isLowVersion) {
    log.warning('当前版本 ${version} 不是最新版本，可以执行 werk-cli update 进行更新！');
  }
  return isLowVersion;
};

const create = async (projectName: string) => {
  // 初始化模板列表
  const templateList = Array.from(templates).map((item: [string, TemplateInfo]) => {
    const [value, info] = item;
    return {
      value,
      name: info.name,
    };
  });
  if (!projectName) {
    projectName = await input({
      message: '请输入项目名称',
    });
  }

  // 如果文件夹已经存在，提示用户是否覆盖
  const filePath = path.resolve(process.cwd(), projectName);
  if (fs.existsSync(filePath)) {
    const isExist = await isOverwrite(filePath);
    if (isExist) {
      await fs.remove(filePath);
    } else {
      return;
    }
  }

  // 检查版本更新
  await checkVersion(name, version);

  const templateName = await select({
    message: '请选择模板',
    choices: templateList,
  });
  const info = templates.get(templateName);

  if (info) {
    clone(info.downloadUrl, projectName, ['-b', info.branch]);
  }
};

export default create;
