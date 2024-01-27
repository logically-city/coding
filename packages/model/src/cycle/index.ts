/**
 * 生命周期
 */
export class LifeCycle<Map extends { [K in keyof Map]: (...args: any) => any }> {
  private cycleList: Array<Map> = [];

  on(cycle: Map) {
    this.cycleList.push(cycle);

    return this;
  }

  emit<T extends keyof Map = keyof Map>(name: T, ...args: Parameters<Map[T]>) {
    for (const cycle of this.cycleList) {
      cycle[name]?.apply(this, args);
    }

    return this;
  }

  remove(cycle: Map) {
    const index = this.cycleList.indexOf(cycle);
    if (index !== -1) this.cycleList.splice(index, 1);

    return this;
  }

  clear() {
    this.cycleList = [] as typeof this.cycleList;

    return this;
  }

  cycles() {
    return [...this.cycleList];
  }
}
