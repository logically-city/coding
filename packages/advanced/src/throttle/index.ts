/**
 * 节流函数选项
 */
interface ThrottleOptions {
  /**
   * 间隔
   * @default 1000
   */
  interval?: number;
  /**
   * 结束后执行
   * @description 在节流结束后执行调用
   * @default false
   */
  trailing?: boolean;
}

/**
 * 创建节流函数
 * @description interval 内执行一次
 */
export const createThrottle = <T extends (...args: any[]) => void>(callback: T, options: ThrottleOptions = {}) => {
  const { interval = 1000, trailing = false } = options;
  let timeout: NodeJS.Timeout | null = null;
  let runTime = 0;

  /**
   * 节流函数
   */
  const throttled = (...args: Parameters<T>) => {
    if (timeout) return;

    const nowTime = Date.now();
    const intervalTime = nowTime - runTime;

    if (intervalTime > interval) {
      runTime = nowTime;
      callback(...args);
    }

    timeout = setTimeout(() => {
      timeout = null;
      if (trailing) {
        runTime = Date.now();
        callback(...args);
      }
    }, interval);
  };

  /**
   * 取消节流
   */
  throttled.cancel = () => {
    runTime = 0;
    if (timeout) clearTimeout(timeout);
  };

  return throttled;
};
