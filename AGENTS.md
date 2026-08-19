# Pi Extensions 仓库规范

本文件适用于整个仓库。更深层目录中的 `AGENTS.md` 可以补充包级规则。

## 仓库定位

- 本仓库使用 npm Workspaces 管理多个可独立发布的 Pi 扩展。
- 根 `package.json` 仅用于编排 Workspaces，必须保持 `private: true`，不得发布根包。
- 每个正式扩展必须位于 `packages/<package-name>/`，不要把扩展源码直接放在仓库根目录。

## 包结构

新增扩展默认使用以下结构：

```text
packages/<package-name>/
├── src/
│   └── index.ts
├── tests/
├── package.json
├── README.md
└── LICENSE
```

- `src/index.ts` 是扩展入口，并在包级 `package.json` 的 `pi.extensions` 中显式声明。
- 每个包必须能够独立测试、打包和发布。
- 根 README 维护扩展目录和仓库级说明；功能、配置和使用细节写入包级 README。
- 除非包有不同授权，包内 `LICENSE` 必须与根 `LICENSE` 保持一致，确保 npm 压缩包包含许可证文本。

## 依赖与发布内容

- Pi 提供的核心包使用 `peerDependencies` 的 `"*"` 范围，不要打包：`@earendil-works/pi-ai`、`@earendil-works/pi-agent-core`、`@earendil-works/pi-coding-agent`、`@earendil-works/pi-tui`、`typebox`。
- 第三方运行时依赖放入包级 `dependencies`；仅用于开发和测试的依赖放入 `devDependencies`。
- 包级 `package.json` 使用 `files` 白名单，只发布运行所需源码、README 和 LICENSE。
- 不提交或发布 `node_modules/`、`*.tgz`、凭据、私密配置和本地 Session 数据。

## 修改原则

- 保持改动最小，不对其他扩展进行无关重构。
- 行为变化应补充或更新测试；纯文档变化可以不重复运行代码测试，但必须检查 diff。
- 新增扩展后同步更新根 README 的扩展列表、安装命令和必要的开发说明。
- 修改扩展入口、安装命令、包名或目录结构时，同步更新相关 manifest、测试和 README。

## 验证

从仓库根目录按改动范围运行：

```bash
npm test
npm test --workspace <package-name>
pi -e ./packages/<directory-name> --list-models
npm pack --dry-run --workspace <package-name>
```

发布前还必须运行对应包的 `npm publish --dry-run`，并检查 tarball 文件列表、版本号、包名和敏感信息。

## Git 与发布边界

- 除非用户明确要求，否则不要创建 Git commit。
- 未经用户在看到改动、验证结果、敏感信息检查和目标远端后再次确认，不得执行 `git push`、公开仓库或其他远端同步。
- 未经再次确认，不得执行正式 `npm publish`。
- 每次只发布指定 Workspace，禁止从根目录误发包。
