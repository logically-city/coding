/**
 * 事件中心
 */
export class EventCentre<
  Map extends Record<string, (...args: any) => any>,
  Name extends keyof Map | (string & Record<never, never>) = keyof Map | (string & Record<never, never>)
> {
  private eventMap = {} as Record<Name, Array<Map[Name]>>;

  on<T extends Name = Name>(name: T, listener: Map[T]) {
    if (this.eventMap[name]) this.eventMap[name].push(listener);
    else this.eventMap[name] = [listener];

    return this;
  }

  once<T extends Name = Name>(name: T, listener: Map[T]) {
    const _listener = ((...args: any[]) => {
      const result = listener.apply(this, args);
      this.remove(name, _listener);
      return result;
    }) as Map[T];

    this.on(name, _listener);

    return this;
  }

  emit<T extends Name = Name>(name: T, ...args: Parameters<Map[T]>) {
    for (const listener of this.listeners(name)) {
      listener?.apply(this, args);
    }

    return this;
  }

  remove<T extends Name = Name>(name: T, listener: Map[T]) {
    const list = this.eventMap[name];

    if (list?.length) {
      const index = list.indexOf(listener);
      if (index !== -1) list.splice(index, 1);
    }

    return this;
  }

  clear() {
    this.eventMap = {} as typeof this.eventMap;

    return this;
  }

  listeners<T extends Name = Name>(name: T) {
    return Array.from(this.eventMap[name] || []);
  }
}
