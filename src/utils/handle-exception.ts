// 优雅地处理各种终止信号和异常，静默退出
const silentExit = () => process.exit(0);

const handleException = () => {
  // 处理用户中断（Ctrl+C）和终止信号
  process.on('SIGINT', silentExit);
  process.on('SIGTERM', silentExit);

  // 防止未捕获的异常和Promise拒绝导致堆栈跟踪输出
  process.on('uncaughtException', silentExit);
  process.on('unhandledRejection', silentExit);
};

export default handleException;
