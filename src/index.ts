#!/usr/bin/env node
import { Command } from 'commander';

import { create, update } from '@/command';
import { handleException } from '@/utils';

import { version } from '../package.json';

// 处理用户中断（Ctrl+C）和终止信号
handleException();

const program = new Command('werk-cli');

program.version(version, '-v, --version');

program.command('update').description('更新werk-cli').action(update);

program
  .command('create')
  .description('创建一个新项目')
  .argument('[name]', '项目名称（可选）')
  .action(create);

program.parse();
