import { createPromise } from '..';

describe('createPromise', () => {
  it('应做出承诺并允许外部解决', async () => {
    const { promise, resolve } = createPromise<string>();

    const testValue = 'Hello, World!';
    setTimeout(() => resolve(testValue), 50);

    const result = await promise;
    expect(result).toBe(testValue);
  });

  it('应创造一个承诺并允许外部拒绝', async () => {
    const { promise, reject } = createPromise<string>();

    const testError = new Error('Test error');
    setTimeout(() => reject(testError), 50);

    try {
      await promise;
    } catch (error) {
      expect(error).toBe(testError);
    }
  });
});
