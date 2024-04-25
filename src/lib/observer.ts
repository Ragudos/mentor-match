type Subscriber<T> = (data: T) => void;

class Observer<T> {
  private subscribers: Subscriber<T>[] = [];

  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber: Subscriber<T>) {
    this.subscribers.push(subscriber);

    return () => {
      this.unsubscribe(subscriber);
    };
  }

  unsubscribe(subscriber: Subscriber<T>) {
    const idx = this.subscribers.indexOf(subscriber);

    if (idx === -1) {
      return;
    }

    this.subscribers.splice(idx, 1);
  }

  notify(data: T) {
    for (let i = 0; i < this.subscribers.length; i++) {
      this.subscribers[i](data);
    }
  }
}

export default Observer;
