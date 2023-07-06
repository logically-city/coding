import { PromiseOr } from '@lyrical/types';

/**
 * 洋葱中间件
 * 1.return undefined 结束当前中间件
 * 2.return false 结束当前调用链
 * 3.return ctx 改变 ctx
 */
export type IOnionMiddlewareHandler<T> = (
  ctx: T,
  next: (params: T, options?: { jump?: boolean }) => Promise<false | void | T | undefined>
) => PromiseOr<false | void | T | undefined>;

/**
 * 洋葱中间件选项
 */
export interface IOnionMiddlewareOptions {
  /**
   * 循环模式下，中间件返回 `false` 时，返回中间件 `ctx`
   */
  break?: boolean;
}

/**
 * 中间件
 */
interface IMiddleware<T> extends IOnionMiddlewareOptions {
  /**
   * 中间件处理函数
   */
  handle: IOnionMiddlewareHandler<T>;
}

/**
 * 洋葱模型
 */
export class Onion<T> {
  /**
   * 中间件列表
   */
  private middlewareList: Array<IMiddleware<T>> = [];

  private options: {
    /**
     * 是否开启循环模式
     */
    loop: boolean;
  };

  constructor(
    options: {
      /**
       * 是否开启循环模式
       */
      loop: boolean;
    } = { loop: false }
  ) {
    this.options = options;
  }

  /**
   * 注册使用中间件
   * @param handle 处理函数
   * @param options 参数
   */
  use(
    handle: IOnionMiddlewareHandler<T> | Array<IOnionMiddlewareHandler<T>>,
    options: IOnionMiddlewareOptions = {}
  ): Onion<T> {
    const handles = Array.isArray(handle) ? handle : [handle];

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
    const dispatch = async (index: number, params = ctx): Promise<false | void | T | undefined> => {
      if (index === this.middlewareList.length) return;

      const { handle, ...options } = this.middlewareList[index];

      const result = await handle(params, p => dispatch(index + 1, p || params));

      if (!this.options.loop) {
        if (result === false) return false;
        else if (result !== undefined) return result;
        return;
      }

      if (result === false) {
        if (options.break) return params;
        return false;
      } else if (result !== undefined) params = result;

      return dispatch(index + 1, params);
    };

    return dispatch(0);
  }
}
