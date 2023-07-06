import createDebounceInterval from '..';
jest.useFakeTimers();

const ref = { current: 1 };
const c = createDebounceInterval(() => {
  ref.current += 1;
});

c();

test('debounce 1', () => {
  expect(ref.current).toBe(1);
});

test('debounce 2', () => {
  setTimeout(() => {
    expect(ref.current).toBe(34);
  }, 1001);
});
