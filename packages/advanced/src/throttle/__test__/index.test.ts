import createThrottleInterval from '..';

test('createThrottleInterval', () => {
  const c = createThrottleInterval(v => v);

  expect(c(1)).toBe(1);

  // expect(c(2)).toBe(2);
});
