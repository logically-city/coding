import { createThrottle } from '..';

// 模拟回调函数
const mockCallback = jest.fn();

// 模拟定时器
jest.useFakeTimers();

describe('createThrottle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该在指定间隔内执行一次回调函数', () => {
    const throttledFunction = createThrottle(mockCallback, { interval: 1000 });

    // 连续调用节流函数
    throttledFunction();
    throttledFunction();
    throttledFunction();
    throttledFunction();
    throttledFunction();

    // 回调函数应执行一次
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // 将定时器时间推进 1000 毫秒
    jest.advanceTimersByTime(1000);

    // 回调函数应该只被调用一次
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('当 `trailing` 为 true 时，应在节流结束后执行一次回调函数', () => {
    const throttledFunction = createThrottle(mockCallback, { interval: 1000, trailing: true });

    // 连续调用节流函数
    throttledFunction();
    throttledFunction();
    throttledFunction();
    throttledFunction();
    throttledFunction();

    // 回调函数应执行一次
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // 将定时器时间推进 1000 毫秒
    jest.advanceTimersByTime(1000);

    // 回调函数应该被调用两次，一次在节流开始，一次在节流结束后
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('在取消节流后，不应触发 trailing 回调', () => {
    const throttledFunction = createThrottle(mockCallback, { interval: 1000, trailing: true });

    // 连续调用节流函数
    throttledFunction();
    throttledFunction();
    throttledFunction();
    throttledFunction();
    throttledFunction();

    // 回调函数应执行一次
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // 取消节流
    throttledFunction.cancel();

    // 将定时器时间推进 1000 毫秒
    jest.advanceTimersByTime(1000);

    // 回调函数不应被调用
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
