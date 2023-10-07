import { sleep } from '..';

test('sleep', async () => {
  const start = Date.now();
  await sleep(1000); // 暂停1秒
  const end = Date.now();
  const duration = end - start;

  // 检查是否真的暂停了大约1秒
  expect(duration).toBeGreaterThanOrEqual(1000);
  expect(duration).toBeLessThan(1020);
});
