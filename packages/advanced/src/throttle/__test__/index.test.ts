import createThrottleInterval from '..';
jest.useFakeTimers();

const ref = { current: 1 };
const c = createThrottleInterval(() => {
  ref.current += 1;
});

c();

test('current + 1 as 2', () => {
  expect(ref.current).toBe(2);
});

c();

test('current + 1 as 2', () => {
  expect(ref.current).toBe(2);
});

test('current timeout + 1 as 3', () => {
  setTimeout(() => {
    expect(ref.current).toBe(2);
    c();
    setTimeout(() => {
      expect(ref.current).toBe(3);
    }, 1001);
    jest.runAllTimers();
  }, 1001);
  jest.runAllTimers();
});
