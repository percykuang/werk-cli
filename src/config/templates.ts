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
    'vue-typescript-template',
    {
      name: 'Vue3 + TypeScript',
      downloadUrl: 'git@github.com:percykuang/vue-ts-template.git',
      branch: 'main',
    },
  ],
]);

export default templates;
