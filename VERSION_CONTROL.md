# 自动版本控制

本项目使用语义化版本控制（Semantic Versioning）来管理版本号。版本号格式为：`主版本号.次版本号.修订号`。

## 版本发布流程

**需要手动执行在控制台 git 命令，用 vscode 等自动提交工具不会触发自动升级**

1. git add .
2. git commit -m "feat(patch): 小改动"
3. git push
4. 系统会自动升级版本号，并创建一个版本提交和Git标签
5. pnpm run release

## 自动版本升级

系统会在代码推送前检查提交信息，**只有当明确指定版本升级类型时**，才会自动升级版本号：

1. 当提交信息包含 `(major):` 或以 `major:` 开头时，自动升级主版本号
2. 当提交信息包含 `(minor):` 或以 `minor:` 开头时，自动升级次版本号
3. 当提交信息包含 `(patch):` 或以 `patch:` 开头时，自动升级修订号

如果提交信息中没有包含上述关键字，则不会触发版本升级。

> **注意**：系统使用 standard-version 工具进行版本管理，会自动生成CHANGELOG.md文件，记录版本变更历史。

## 提交信息示例

```
feat(major): 完全重构API，不兼容旧版本
```

```
feat(minor): 添加新功能，向后兼容
```

```
fix(patch): 修复某个bug
```

## 手动版本升级

如果需要手动升级版本号，可以使用以下命令：

```bash
# 升级修订号 (0.0.1 -> 0.0.2)
npm run release:patch

# 升级次版本号 (0.0.1 -> 0.1.0)
npm run release:minor

# 升级主版本号 (0.0.1 -> 1.0.0)
npm run release:major
```

这些命令会自动：

1. 升级package.json中的版本号
2. 创建一个版本提交
3. 为该版本创建一个Git标签
4. 更新CHANGELOG.md文件，记录版本变更历史

## 提交格式示例

以下是一些提交信息的示例：

```
feat: 添加新功能（不会触发版本升级）
```

```
fix(patch): 修复某个bug（会触发补丁版本升级）
```

```
feat(minor): 添加新功能（会触发次版本升级）
```

```
feat(major): 完全重构API（会触发主版本升级）
```

只有当提交信息中包含`(patch)`、`(minor)`或`(major)`关键字时，才会触发相应的版本升级。
