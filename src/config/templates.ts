export interface TemplateInfo {
  name: string;
  downloadUrl: string;
  branch: string;
}

const templates: Map<string, TemplateInfo> = new Map([
  [
    'vite-vue3-typescript-template',
    {
      name: 'Vite + Vue3 + TypeScript 模板 (GitHub)',
      downloadUrl: 'git@github.com:percykuang/css-scope-loader.git',
      branch: 'main',
    },
  ],
  [
    'vite-vue3-typescript-template-dev10',
    {
      name: 'Vite + Vue3 + TypeScript 模板 (Gitee dev10分支)',
      downloadUrl: 'git@gitee.com:sohucw/admin-pro.git',
      branch: 'dev10',
    },
  ],
]);

export default templates;
