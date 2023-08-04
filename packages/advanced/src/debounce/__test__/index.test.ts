import { createDebounce } from '..';

// 模拟回调函数
const mockCallback = jest.fn();

// 使用 Jest 的定时器模拟（setTimeout 和 clearTimeout）
jest.useFakeTimers();

describe('createDebounce', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该在指定间隔后执行一次回调函数', () => {
    const debouncedFunction = createDebounce(mockCallback, { interval: 1000 });

    // 快速多次调用防抖函数
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();

    // 将定时器时间推进 1000 毫秒
    jest.advanceTimersByTime(1000);

    // 回调函数应该只被调用一次，在时间间隔后执行
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('当立即执行选项为 true 时，应立即执行回调函数', () => {
    const debouncedFunction = createDebounce(mockCallback, { interval: 1000, immediate: true });

    // 快速多次调用防抖函数
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();

    // 回调函数应该立即执行一次
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // 将定时器时间推进 1000 毫秒
    jest.advanceTimersByTime(1000);

    // 在时间间隔后，回调函数不应再次被调用
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('当调用取消函数时，应取消防抖', () => {
    const debouncedFunction = createDebounce(mockCallback, { interval: 1000 });

    // 快速多次调用防抖函数
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();

    // 调用取消函数
    debouncedFunction.cancel();

    // 将定时器时间推进 1000 毫秒
    jest.advanceTimersByTime(1000);

    // 回调函数不应被调用
    expect(mockCallback).toHaveBeenCalledTimes(0);
  });
});
