import { IOnionMiddlewareHandler, Onion } from '..';

type IContext = { data: number };
type IMiddleware = IOnionMiddlewareHandler<IContext>;

describe('Onion', () => {
  it('应正确触发洋葱中间件', async () => {
    const onion = new Onion<IContext>();

    const middleware1: IMiddleware = async (ctx, next) => {
      ctx.data += 1;
      await next(ctx);
      ctx.data += 1;
    };

    const middleware2: IMiddleware = async (ctx, next) => {
      ctx.data *= 2;
      await next(ctx);
      ctx.data *= 2;
    };

    const ctx = { data: 2 };
    await onion.use([middleware1, middleware2]).trigger(ctx);

    expect(ctx.data).toBe(13);
  });

  it('应正确在循环模式下触发洋葱中间件', async () => {
    const onion = new Onion<IContext>({ loop: true });

    const middleware1: IMiddleware = async (ctx, next) => {
      ctx.data += 1;
      await next(ctx);
      ctx.data += 1;
    };

    const middleware2: IMiddleware = async (ctx, next) => {
      if (ctx.data > 4) return false;
      ctx.data *= 2;
      await next(ctx);
      ctx.data *= 2;
    };

    const ctx = { data: 2 };
    const result = await onion.use([middleware1, middleware2]).trigger(ctx);

    expect(result).toBe(false);
    expect(ctx.data).toBe(13);
  });

  it('应正确在循环模式下触发洋葱中间件并使用 break 选项', async () => {
    const onion = new Onion<IContext>({ loop: true });

    const middleware1: IMiddleware = async (ctx, next) => {
      ctx.data += 1;
      await next(ctx);
      ctx.data += 1;
    };

    const middleware2: IMiddleware = async (ctx, next) => {
      if (ctx.data > 4) return false;
      ctx.data *= 2;
      await next(ctx);
      ctx.data *= 2;
    };

    const ctx = { data: 2 };
    const result = (await onion.use(middleware1).use(middleware2, { break: true }).trigger(ctx)) as IContext;

    expect(result.data).toBe(13);
    expect(ctx.data).toBe(13);
  });
});
