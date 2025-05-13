import { select } from '@inquirer/prompts';

import 'tslib';

import log from './log';

const isOverwrite = async (dir: string): Promise<boolean> => {
  log.warning(`目标目录 ${dir} 已存在`);
  return await select({
    message: '是否覆盖？',
    choices: [
      {
        name: '是',
        value: true,
      },
      {
        name: '否',
        value: false,
      },
    ],
  });
};

export default isOverwrite;
