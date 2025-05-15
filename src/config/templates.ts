export interface TemplateInfo {
  name: string;
  downloadUrl: string;
  branch: string;
}

const templates: Map<string, TemplateInfo> = new Map([
  [
    'react-typescript-template',
    {
      name: 'React + TypeScript',
      downloadUrl: 'git@github.com:percykuang/react-ts-template.git',
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
