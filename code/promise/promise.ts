type PromiseSucceedFn = null | ((result?: any) => void);
type PromiseFailFn = null | ((reason?: any) => void);
type PromiseState = "pending" | "fulfilled" | "rejected";
type PromiseHandler = [PromiseSucceedFn, PromiseFailFn];
type PromiseCallback = Array<PromiseHandler>;

const Util_isFunction = (value: any): boolean => {
  return typeof value === "function";
};

class Promise2 {
  callback: PromiseCallback = [];
  state: PromiseState = "pending";
  constructor(fn: any) {
    if (!Util_isFunction(fn)) {
      throw new Error("Promise 必须接受一个函数作为参数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  resolve(result: any) {
    if (this.state !== "pending") return;
    this.changeState("fulfilled");
    setTimeout(() => {
      this.callback.forEach(handler => {
        const [succeed] = handler;
        // 不加 this.succeed, typescript 会认为有可能为 null
        if (Util_isFunction(succeed) && succeed) {
          succeed.call(undefined, result);
        }
      });
    }, 0);
  }
  reject(reason: any) {
    if (this.state !== "pending") return;
    this.changeState("rejected");
    setTimeout(() => {
      this.callback.forEach(handler => {
        const [, fail] = handler;
        // 不加 this.succeed, typescript 会认为有可能为 null
        if (Util_isFunction(fail) && fail) {
          fail.call(undefined, reason);
        }
      });
    }, 0);
  }
  then(succeed: PromiseSucceedFn = null, fail: PromiseFailFn = null): any {
    this.callback.push([succeed, fail]);
  }
  changeState(state: PromiseState) {
    this.state = state;
  }
}

export { Promise2 };
