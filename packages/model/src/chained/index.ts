import { PromiseOr } from '@logically/types';

/**
 * 链式中间件
 * 1.return undefined 结束当前中间件
 * 2.return false 结束当前调用链
 * 3.return ctx 改变 ctx
 */
export type IChainedMiddlewareHandler<T> = (ctx: T) => PromiseOr<T | false | undefined | void>;

/**
 * 链式中间件注册选项
 */
interface IChainedMiddlewareUseOptions {
  /**
   * 在最后使用
   */
  afterUse?: boolean;
}

/**
 * 链式中间件选项
 */
export interface IChainedMiddlewareOptions<T> extends IChainedMiddlewareUseOptions {
  /**
   * 通过函数判断是否使用中间件
   */
  check?: (ctx: T) => PromiseOr<boolean>;
}

/**
 * 中间件
 */
interface IMiddleware<T> extends Omit<IChainedMiddlewareOptions<T>, keyof IChainedMiddlewareUseOptions> {
  /**
   * 中间件处理函数
   */
  handle: IChainedMiddlewareHandler<T>;
}

/**
 * 链式模型
 */
export class Chained<T> {
  /**
   * 中间件列表
   */
  private middlewareList: Array<IMiddleware<T>> = [];

  /**
   * 后置中间件
   */
  private afterMiddlewareList: Array<IMiddleware<T>> = [];

  /**
   * 触发列表
   */
  private get triggerList() {
    return [...this.middlewareList, ...this.afterMiddlewareList];
  }

  /**
   * 注册使用中间件
   * @param handle 处理函数
   * @param options 参数
   */
  use(
    handle: IChainedMiddlewareHandler<T> | Array<IChainedMiddlewareHandler<T>>,
    options: IChainedMiddlewareOptions<T> = {}
  ): Chained<T> {
    const handles = Array.isArray(handle) ? handle : [handle];

    if (options.afterUse) {
      handles.forEach(handle =>
        this.afterMiddlewareList.push({
          handle,
          ...options
        })
      );

      return this;
    }

    handles.forEach(handle =>
      this.middlewareList.push({
        handle,
        ...options
      })
    );

    return this;
  }

  /**
   * 触发中间件
   * @param ctx 上下文
   */
  async trigger(ctx: T) {
    for (let i = 0, n = this.triggerList.length; i < n; i++) {
      const { handle, check } = this.triggerList[i];

      /* 中间件处理 */
      let res;
      if (check) {
        if (check(ctx)) res = await handle(ctx);
      } else res = await handle(ctx);

      /* 返回判断 */
      if (res === false) return false;
      else if (res !== undefined) ctx = res;
    }

    return ctx;
  }
}
