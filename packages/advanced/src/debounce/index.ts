/**
 * 防抖函数选项
 */
interface DebounceOptions {
  /**
   * 间隔
   * @default 1000
   */
  interval?: number;
  /**
   * 开始前执行
   * @description 在防抖开始前执行调用
   * @default false
   */
  leading?: boolean;
}

/**
 * 创建防抖函数
 * @description interval 后执行一次
 */
export const createDebounce = <T extends (...args: any[]) => void>(callback: T, options: DebounceOptions = {}) => {
  const { interval = 1000, leading = false } = options;
  let timeout: number | null = null;

  /**
   * 防抖函数
   */
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    if (leading && !timeout) {
      callback(...args);
    }

    timeout = setTimeout(() => {
      timeout = null;
      if (!leading) callback(...args);
    }, interval) as unknown as number;
  };

  /**
   * 取消防抖
   */
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return debounced;
};
