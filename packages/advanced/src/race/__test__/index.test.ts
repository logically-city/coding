import createRaceLock from '..';
jest.useFakeTimers();

const service = (v: number) =>
  new Promise(resolve => {
    setTimeout(() => resolve(v), 1000);
    jest.runAllTimers();
  });

const serviceRequest = createRaceLock(service);

const result1 = serviceRequest(1);
const result2 = serviceRequest(2);

test('race result 1 as 1', async () => {
  await expect(result1).resolves.toBe(1);
});

test('race result 2 as 1', async () => {
  await expect(result2).resolves.toBe(1);
});

test('race result 3 as 3', async () => {
  await expect(serviceRequest(3)).resolves.toBe(3);
});
