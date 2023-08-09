import { LifeCycle } from '..';

describe('LifeCycle', () => {
  it('应正确订阅和触发生命周期函数', () => {
    const lifeCycle = new LifeCycle<{
      created: () => void;
      updated: (data: string) => void;
    }>();

    const createdListener = jest.fn();
    const updatedListener = jest.fn();

    lifeCycle.on({ created: createdListener, updated: updatedListener });

    lifeCycle.emit('created');
    expect(createdListener).toHaveBeenCalled();

    lifeCycle.emit('updated', 'new data');
    expect(updatedListener).toHaveBeenCalledWith('new data');
  });

  it('应正确移除生命周期函数', () => {
    const lifeCycle = new LifeCycle<{ event: () => void }>();

    const listener = jest.fn();
    const cycle = { event: listener };
    lifeCycle.on(cycle);

    lifeCycle.emit('event');
    expect(listener).toHaveBeenCalled();

    lifeCycle.remove(cycle);
    lifeCycle.emit('event');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('应正确清除所有生命周期函数', () => {
    const lifeCycle = new LifeCycle<{ event: () => void }>();

    const listener = jest.fn();
    lifeCycle.on({ event: listener });

    lifeCycle.clear();
    lifeCycle.emit('event');
    expect(listener).not.toHaveBeenCalled();
  });

  it('应正确获取生命周期函数数组', () => {
    const lifeCycle = new LifeCycle<{ event: () => void }>();

    const listener1 = jest.fn();
    const listener2 = jest.fn();

    lifeCycle.on({ event: listener1 });
    lifeCycle.on({ event: listener2 });

    const cycles = lifeCycle.cycles();
    expect(cycles).toHaveLength(2);
  });
});
