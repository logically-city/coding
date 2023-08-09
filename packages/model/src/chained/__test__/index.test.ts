import { Chained, IChainedMiddlewareHandler } from '..'; // 替换为实际的路径

describe('Chained', () => {
  it('应正确触发普通中间件', async () => {
    const chained = new Chained<number>();

    const middleware1: IChainedMiddlewareHandler<number> = async ctx => ctx + 1;
    const middleware2: IChainedMiddlewareHandler<number> = async ctx => ctx * 2;

    chained.use(middleware1).use(middleware2);

    const result = await chained.trigger(2);

    expect(result).toBe(6);
  });

  it('应正确触发后置中间件', async () => {
    const chained = new Chained<string>();

    const middleware1: IChainedMiddlewareHandler<string> = async ctx => ctx + ' world';
    const middleware2: IChainedMiddlewareHandler<string> = async ctx => ctx.toUpperCase();

    chained.use(middleware1, { afterUse: true }).use(middleware2);

    const result = await chained.trigger('hello');

    expect(result).toBe('HELLO world');
  });

  it('当中间件返回 false 时，应提前结束调用链', async () => {
    const chained = new Chained<number>();

    const middleware1: IChainedMiddlewareHandler<number> = async ctx => ctx * 2;
    const middleware2: IChainedMiddlewareHandler<number> = async () => false as false; // 提前结束调用链
    const middleware3: IChainedMiddlewareHandler<number> = async ctx => ctx + 1;

    chained.use(middleware1).use(middleware2).use(middleware3);

    const result = await chained.trigger(3);

    expect(result).toBe(false);
  });

  it('当中间件返回 undefined 时，应提前结束当前中间件', async () => {
    const chained = new Chained<number>();

    const middleware1: IChainedMiddlewareHandler<number> = async ctx => ctx * 2;
    const middleware2: IChainedMiddlewareHandler<number> = async () => undefined; // 提前结束当前中间件
    const middleware3: IChainedMiddlewareHandler<number> = async ctx => ctx + 1;

    chained.use(middleware1).use(middleware2).use(middleware3);

    const result = await chained.trigger(3);

    expect(result).toBe(7);
  });

  it('当中间件返回 ctx 时，应传递给下一个中间件', async () => {
    const chained = new Chained<number>();

    const middleware1: IChainedMiddlewareHandler<number> = async ctx => ctx * 2;
    const middleware2: IChainedMiddlewareHandler<number> = async ctx => ctx + 5;

    chained.use(middleware1).use(middleware2);

    const result = await chained.trigger(3);

    expect(result).toBe(11);
  });

  it('应正确使用 check 函数控制中间件的执行', async () => {
    const chained = new Chained<number>();

    const middleware1: IChainedMiddlewareHandler<number> = async ctx => ctx * 2;
    const middleware2: IChainedMiddlewareHandler<number> = async ctx => ctx + 5;

    const checkFn = (ctx: number) => ctx > 5; // 仅当 ctx 大于 5 时执行中间件

    chained.use(middleware1, { check: checkFn }).use(middleware2, { check: checkFn });

    const result1 = await chained.trigger(3);
    const result2 = await chained.trigger(7);

    expect(result1).toBe(3); // 未满足 check 条件，不执行中间件
    expect(result2).toBe(19); // 满足 check 条件，执行中间件
  });
});
