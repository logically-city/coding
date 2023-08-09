import { EventCentre } from '..';

describe('EventCentre', () => {
  it('应正确订阅和触发事件', () => {
    const eventCenter = new EventCentre<{ event1: (data: string) => void }>();

    const listener = jest.fn();
    eventCenter.on('event1', listener);

    eventCenter.emit('event1', 'Hello, world!');

    expect(listener).toHaveBeenCalledWith('Hello, world!');
  });

  it('应正确触发一次性事件', () => {
    const eventCenter = new EventCentre<{ event2: (count: number) => void }>();

    const listener = jest.fn();
    eventCenter.once('event2', listener);

    eventCenter.emit('event2', 42);
    eventCenter.emit('event2', 42);

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('应正确移除事件监听器', () => {
    const eventCenter = new EventCentre<{ event3: (data: string) => void }>();

    const listener = jest.fn();
    eventCenter.on('event3', listener);

    eventCenter.remove('event3', listener);
    eventCenter.emit('event3', 'This will not be received');

    expect(listener).not.toHaveBeenCalled();
  });

  it('应正确清除所有事件监听器', () => {
    const eventCenter = new EventCentre<{ event4: (data: string) => void }>();

    const listener = jest.fn();
    eventCenter.on('event4', listener);

    eventCenter.clear();
    eventCenter.emit('event4', 'This will not be received');

    expect(listener).not.toHaveBeenCalled();
  });

  it('应正确获取事件监听器数组', () => {
    const eventCenter = new EventCentre<{ event5: (data: string) => void }>();

    const listener1 = jest.fn();
    const listener2 = jest.fn();

    eventCenter.on('event5', listener1);
    eventCenter.on('event5', listener2);

    const listeners = eventCenter.listeners('event5');
    expect(listeners).toHaveLength(2);
  });
});
