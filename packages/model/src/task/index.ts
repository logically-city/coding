type TaskHandler = (...args: any[]) => any | Promise<any>;

interface TaskParameters {
  concurrency: number;
}

interface TaskQueueItem<T extends TaskHandler> {
  task: T;
  resolve: (value: Awaited<ReturnType<T>>) => void;
  reject: (reason?: any) => void;
  priority: number;
}

/**
 * 任务模型
 */
export class Task<T extends TaskHandler = TaskHandler> {
  private concurrency: number;
  private running: number;
  private taskQueue: Array<TaskQueueItem<T>>;
  private paused: boolean;

  constructor(parameters: TaskParameters) {
    const { concurrency } = parameters;
    this.concurrency = concurrency;
    this.running = 0;
    this.taskQueue = [];
    this.paused = false;
  }

  private async run() {
    if (this.paused || this.running >= this.concurrency || this.taskQueue.length === 0) {
      return;
    }

    this.running++;
    const { task, resolve, reject } = this.taskQueue.shift()!;
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.run();
    }
  }

  suspend() {
    this.paused = true;
  }

  recover() {
    this.paused = false;
    this.run();
  }

  add(task: T, priority = 0) {
    return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
      this.taskQueue.push({ task, priority, resolve, reject });
      this.taskQueue.sort((a, b) => b.priority - a.priority);
      this.run();
    });
  }

  clear() {
    this.taskQueue = [];
  }
}
