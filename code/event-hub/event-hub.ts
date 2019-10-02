interface EventCallBack {
  (data?: unknown): void;
}
interface EventHubCache {
  [key: string]: Array<EventCallBack>;
}

class EventHub {
  cache: EventHubCache = {};

  on(eventName: string, callback: EventCallBack): void {
    this.cache[eventName] = this.cache[eventName] || [];
    this.cache[eventName].push(callback);
  }
  off(eventName: string, offCallback: EventCallBack): void {
    this.cache[eventName] = (this.cache[eventName] || []).filter(
      callback => callback !== offCallback
    );
  }
  emit(eventName: string, data?: unknown): void {
    (this.cache[eventName] || []).forEach(callback => callback(data));
  }
}

export { EventHub };
