import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

import path from 'path';
import { defineConfig } from 'rollup';
import externals from 'rollup-plugin-node-externals';
import typescript from 'rollup-plugin-typescript2';
import { fileURLToPath } from 'url';

// 获取绝对路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRootDir = path.resolve(__dirname);

export default defineConfig([
  {
    input: {
      // 入口文件
      index: 'src/index.ts',
    },
    output: [
      {
        // 输出目录
        dir: 'dist',
        // 输出格式，cjs表示commonjs格式，es表示es模块格式，umd表示umd模块格式，iife表示自执行函数格式，auto表示自动判断
        format: 'es',
      },
    ],
    plugins: [
      // 配置路径别名
      alias({
        entries: [{ find: '@', replacement: path.resolve(projectRootDir, 'src') }],
      }),
      // 解析node_modules中的模块
      nodeResolve(),
      externals({
        // 意味着开发依赖会被打包进最终产物
        devDeps: false,
      }),
      // 解析json文件，确保package.json中的版本号被正确导入
      json({
        // 这个选项设置为 true 时，插件会使用 const 声明来定义从 JSON 文件中导入的属性变量，而不是使用 var
        // 这有助于树摇（tree-shaking）优化，因为 const 声明的变量不可变，更容易被分析和优化
        preferConst: true,
        // 这个选项设置为 true 时，插件会为 JSON 对象的每个属性生成命名导出
        // 这样可以使用解构导入的方式从 JSON 文件中导入特定属性，例如 import { version } from './package.json'
        namedExports: true,
      }),
      // 解析ts文件
      typescript(),
      // 解析commonjs模块
      commonjs(),
      // 压缩代码
      terser(),
    ],
  },
]);
