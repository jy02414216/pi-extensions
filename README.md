# Pi Extensions

个人维护的 [Pi](https://github.com/earendil-works/pi-mono) 扩展集合。本仓库采用 npm Workspaces 管理，每个 `packages/*` 子目录都是可以独立测试和发布的 Pi 包。

> Pi 扩展以当前用户权限运行，并且可以访问本地文件或执行命令。请仅安装你信任并审查过源码的扩展。

## 扩展列表

| 包 | 功能 | 安装 |
| --- | --- | --- |
| [`@jy02414216/pi-task-timer`](./packages/pi-task-timer) | 在页脚显示 Agent 每次任务的运行时间 | `pi install npm:@jy02414216/pi-task-timer` |

各扩展的功能、配置和使用方式请查看对应的包目录。

## 使用

安装扩展：

```bash
pi install npm:@jy02414216/pi-task-timer
```

临时试用而不修改 Pi 设置：

```bash
pi -e npm:@jy02414216/pi-task-timer
```

## 仓库结构

```text
packages/
└── <package-name>/
    ├── src/
    │   └── index.ts
    ├── tests/
    ├── package.json
    ├── README.md
    └── LICENSE
```

根目录的 `package.json` 仅用于管理 Workspaces，并通过 `private: true` 防止误发布。每个子包通过自身 `package.json` 中的 `pi` 字段声明扩展入口。

## 本地开发

从仓库根目录临时加载某个扩展：

```bash
pi -e ./packages/pi-task-timer
```

运行全部扩展的测试：

```bash
npm test
```

运行单个扩展的测试：

```bash
npm test --workspace @jy02414216/pi-task-timer
```

检查单个扩展将要发布的文件：

```bash
npm pack --dry-run --workspace @jy02414216/pi-task-timer
```

## 发布

各扩展独立发布，不能发布仓库根包：

```bash
npm publish --workspace @jy02414216/pi-task-timer
```

发布前应先运行测试和 `npm pack --dry-run`，并确认版本号、包内容及 npm 登录账号正确。

## License

除非子包另有声明，本仓库及各扩展均采用 [MIT License](./LICENSE)。发布到 npm 的子包同时包含自己的 `LICENSE` 文件。
