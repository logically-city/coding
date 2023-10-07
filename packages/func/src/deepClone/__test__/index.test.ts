import { deepClone } from '..';

describe('deepClone', () => {
  it('应克隆原始值', () => {
    expect(deepClone(1)).toBe(1);
    expect(deepClone('string')).toBe('string');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('应克隆数组', () => {
    const arr = [1, 'string', { a: 1 }, [2, 3]];
    const cloned = deepClone(arr);

    expect(cloned).toEqual(arr);
    expect(cloned).not.toBe(arr);
    expect(cloned[2]).not.toBe(arr[2]);
    expect(cloned[3]).not.toBe(arr[3]);
  });

  it('应克隆对象', () => {
    const obj = {
      number: 1,
      string: 'string',
      obj: { a: 1 },
      arr: [2, 3],
      date: new Date(),
      regex: /test/gi
    };
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.obj).not.toBe(obj.obj);
    expect(cloned.arr).not.toBe(obj.arr);
    expect(cloned.date).toEqual(obj.date);
    expect(cloned.date).not.toBe(obj.date);
    expect(cloned.regex).toEqual(obj.regex);
    expect(cloned.regex).not.toBe(obj.regex);
  });

  it('应处理循环引用', () => {
    const obj: any = { a: 1 };
    obj.self = obj;
    const cloned = deepClone(obj);

    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.self).toBe(cloned);
    expect(cloned.self).not.toBe(obj.self);
  });

  it('应该克隆Date和RegExp实例', () => {
    const date = new Date();
    const regex = /test/gi;

    expect(deepClone(date)).toEqual(date);
    expect(deepClone(date)).not.toBe(date);
    expect(deepClone(regex)).toEqual(regex);
    expect(deepClone(regex)).not.toBe(regex);
  });
});
