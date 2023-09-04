/**
 * 深拷贝
 * @param target 待拷贝对象
 * @param hash 缓存
 * @returns 拷贝后的对象
 */
export const deepClone = <T>(target: T, hash = new WeakMap()) => {
  if (target == null || typeof target !== 'object') return target;

  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);

  if (hash.has(target)) return hash.get(target);

  const value: any = Array.isArray(target) ? [] : {};
  hash.set(target, value);

  for (const key in target) {
    if (target.hasOwnProperty(key)) {
      value[key] = deepClone(target[key], hash);
    }
  }

  return value;
};
