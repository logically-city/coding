/**
 * 创建竞态锁
 * @description 请求过程中有其他请求 使用最先请求 Promise
 * @param service 请求
 * @returns 请求
 */
const createRaceLock = <T extends (...args: Array<any>) => Promise<any>>(service: T) => {
  let promise: Promise<ReturnType<T>> | null = null;

  return (...args: Parameters<T>) => {
    if (promise) return promise;

    promise = service(...args);

    promise.finally(() => {
      promise = null;
    });

    return promise;
  };
};

export default createRaceLock;
