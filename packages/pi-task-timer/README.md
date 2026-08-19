# pi-task-timer

一个用于 [Pi](https://github.com/earendil-works/pi-mono) 的任务计时扩展，在页脚显示 Agent 每次任务的运行时间。

## 安装

```bash
pi install npm:@jy02414216/pi-task-timer
```

临时试用而不写入 Pi 设置：

```bash
pi -e npm:@jy02414216/pi-task-timer
```

卸载：

```bash
pi remove npm:@jy02414216/pi-task-timer
```

## 本地开发

```bash
pi -e ./packages/pi-task-timer
```

修改全局安装的本地扩展后，可以在 Pi 中执行 `/reload` 重新加载。

## 功能

- Agent 开始工作时，每秒更新已用时间。
- Agent 完全结束后，保留本次任务总耗时。
- 退出或重载 Session 时，自动清理计时器。

## License

[MIT](./LICENSE)
