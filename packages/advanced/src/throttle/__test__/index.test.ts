import createThrottleInterval from '..';
jest.useFakeTimers();

const ref = { current: 1 };
const c = createThrottleInterval(() => {
  ref.current += 1;
});

c();

test('1', () => {
  expect(ref.current).toBe(2);
});

c();

test('2', () => {
  expect(ref.current).toBe(2);
});

test('3', () => {
  setTimeout(() => {
    expect(ref.current).toBe(3);
  }, 1001);
});
