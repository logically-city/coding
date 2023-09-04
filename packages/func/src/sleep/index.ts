/**
 * 睡眠
 * @param ms 睡眠时间
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
