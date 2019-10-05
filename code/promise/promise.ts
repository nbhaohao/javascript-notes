type PromiseSucceedFn = null | ((result?: any) => void);
type PromiseFailFn = null | ((reason?: any) => void);
type PromiseState = "pending" | "fulfilled" | "rejected";
type PromiseHandler = [PromiseSucceedFn, PromiseFailFn, Promise2];
type PromiseCallbacks = Array<PromiseHandler>;

const Util_isFunction = (value: any): boolean => {
  return typeof value === "function";
};

// 在浏览器上模拟 nextTick, 在 node 环境还是使用 process.nextTick
const Util_nextTick = (fn: () => any) => {
  if (process !== undefined && typeof process.nextTick === "function") {
    process.nextTick(fn);
    return;
  }
  let counter = 1;
  const observer = new MutationObserver(fn);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  const trigger = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  trigger();
};

class Promise2 {
  callbacks: PromiseCallbacks = [];
  state: PromiseState = "pending";
  constructor(fn: any) {
    if (!Util_isFunction(fn)) {
      throw new Error("Promise 必须接受一个函数作为参数");
    }
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  private handleResolveOrReject(type: "resolve" | "reject", data: any): void {
    if (this.state !== "pending") return;
    const isHandleResolve = type === "resolve";
    this.changeState(isHandleResolve ? "fulfilled" : "rejected");
    Util_nextTick(() => {
      this.callbacks.forEach(handler => {
        const [succeed, fail, nextPromise] = handler;
        // 不加 this.succeed, typescript 会认为有可能为 null
        const handleFn = isHandleResolve ? succeed : fail;
        if (Util_isFunction(handleFn) && handleFn) {
          let resolveResult;
          try {
            resolveResult = handleFn.call(undefined, data);
          } catch (e) {
            nextPromise.reject(e);
            return;
          }
          nextPromise.resolveWith(resolveResult);
        }
      });
    });
  }
  resolve(result: any) {
    this.handleResolveOrReject("resolve", result);
  }
  reject(reason: any) {
    this.handleResolveOrReject("reject", reason);
  }
  then(succeed: PromiseSucceedFn = null, fail: PromiseFailFn = null): any {
    const nextPromise = new Promise2(() => {});
    this.callbacks.push([succeed, fail, nextPromise]);
    return nextPromise;
  }
  changeState(state: PromiseState) {
    this.state = state;
  }
  resolveWithSelf() {
    this.reject(new TypeError("resolve 参数不得与当前 Promise 对象引用一致"));
  }
  resolveWithPromise(prevResult: Promise2) {
    prevResult.then(
      (result: any) => {
        this.resolve(result);
      },
      (reason: any) => {
        this.reject(reason);
      }
    );
  }
  resolveWithThenable(prevResult: any) {
    let then;
    try {
      then = prevResult.then;
    } catch (e) {
      this.reject(e);
    }
    if (Util_isFunction(then)) {
      try {
        prevResult.then(
          (result: any) => {
            this.resolve(result);
          },
          (reason: any) => {
            this.reject(reason);
          }
        );
      } catch (e) {
        this.reject(e);
      }
    } else {
      this.resolve(prevResult);
    }
  }
  // 这个函数会被 then 方法返回的 "nextPromise" 调用，所以 this 是 nextPromise
  resolveWith(prevResult: any) {
    // 如果引用一样，则抛出错误
    if (this === prevResult) {
      this.resolveWithSelf();
    }
    // 如果返回值是一个 Promise, 我们就必须等这个 Promise 执行完，再 resolve 或者 reject 我们的 promise
    else if (prevResult instanceof Promise2) {
      this.resolveWithPromise(prevResult);
    }
    // 这里其实就想判断一下如果返回值是一个 thenable 的情况
    else if (prevResult instanceof Object) {
      this.resolveWithThenable(prevResult);
    } else {
      this.resolve(prevResult);
    }
  }
}

export { Promise2 };
