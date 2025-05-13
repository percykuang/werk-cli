#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 读取最近的提交信息
function getLatestCommitMessage() {
  try {
    return execSync('git log -1 --pretty=%B').toString().trim();
  } catch (error) {
    console.error('获取最近提交信息失败:', error);
    return '';
  }
}

// 根据提交信息确定版本升级类型
function determineVersionBump(commitMessage) {
  if (commitMessage.includes('(major):') || commitMessage.match(/^major(\(.+\))?:/)) {
    return 'major';
  } else if (commitMessage.includes('(minor):') || commitMessage.match(/^minor(\(.+\))?:/)) {
    return 'minor';
  } else if (commitMessage.includes('(patch):') || commitMessage.match(/^patch(\(.+\))?:/)) {
    return 'patch';
  }

  // 如果没有明确指定版本升级类型，则不进行升级
  return null;
}

// 执行版本升级
function bumpVersion(type) {
  if (!type) {
    console.log('没有检测到版本升级标记，跳过版本升级');
    return;
  }

  try {
    console.log(`执行 ${type} 版本升级...`);

    // 使用standard-version进行版本升级
    execSync(`npx standard-version --release-as ${type} --no-verify`, {
      stdio: 'inherit',
      env: { ...process.env, HUSKY: '0' }, // 禁用husky钩子
    });

    console.log('版本升级完成');
  } catch (error) {
    console.error('版本升级失败:', error);
    process.exit(1);
  }
}

// 主函数
function main() {
  const commitMessage = getLatestCommitMessage();

  // 如果提交消息包含版本升级至，则跳过版本升级（这是自动生成的版本提交）
  if (commitMessage.includes('版本升级至')) {
    console.log('检测到自动版本升级提交，跳过本次操作');
    return;
  }

  const versionType = determineVersionBump(commitMessage);
  bumpVersion(versionType);
}

main();
