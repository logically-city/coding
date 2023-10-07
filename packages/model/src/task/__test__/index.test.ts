import { Task } from '..';

describe('Task类测试', () => {
  test('应当根据并发限制执行任务', async () => {
    const taskQueue = new Task({ concurrency: 2 });

    const mockTask = jest.fn();

    taskQueue.add(mockTask);
    taskQueue.add(mockTask);
    taskQueue.add(mockTask);

    expect(mockTask).toHaveBeenCalledTimes(2);
  });

  test('应当解析添加的任务', async () => {
    const taskQueue = new Task({ concurrency: 1 });

    const result = await taskQueue.add(() => '完成');

    expect(result).toBe('完成');
  });

  test('抛出错误的任务应当被拒绝', async () => {
    const taskQueue = new Task({ concurrency: 1 });

    await expect(
      taskQueue.add(() => {
        throw new Error('错误');
      })
    ).rejects.toThrow('错误');
  });

  test('根据提供的优先级优先执行任务', async () => {
    const taskQueue = new Task({ concurrency: 1 });

    const results: string[] = [];

    taskQueue.add(async () => {
      await new Promise(res => setTimeout(res, 100));
      results.push('低');
    }, 1);

    taskQueue.add(async () => {
      await new Promise(res => setTimeout(res, 100));
      results.push('高');
    }, 20);

    taskQueue.add(async () => {
      await new Promise(res => setTimeout(res, 100));
      results.push('中');
    }, 10);

    // 使用setTimeout来让任务有机会执行
    await new Promise(res => setTimeout(res, 500));

    expect(results).toEqual(['低', '高', '中']);
  });

  test('应当可以暂停和恢复任务处理', async () => {
    const taskQueue = new Task({ concurrency: 1 });

    const mockTask = jest.fn().mockResolvedValue('完成');

    taskQueue.add(mockTask);
    taskQueue.suspend();
    taskQueue.add(mockTask);

    // 使用setTimeout来让其他任务有机会执行
    await new Promise(res => setTimeout(res, 50));

    expect(mockTask).toHaveBeenCalledTimes(1);

    taskQueue.recover();

    await new Promise(res => setTimeout(res, 50));

    expect(mockTask).toHaveBeenCalledTimes(2);
  });
});
