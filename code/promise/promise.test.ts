import { Promise2 } from "./promise";

describe("Promise 测试用例", () => {
  it("是一个类", () => {
    expect(typeof Promise2).toBe("function");
    expect(Promise2.prototype).toBeTruthy();
  });
  it("new Promise 必须接受一个函数", () => {
    expect(() => {
      // @ts-ignore
      new Promise2();
    }).toThrowError();
    expect(() => {
      // @ts-ignore
      new Promise2(1);
    }).toThrowError();
  });
  it("new Promise(fn) 会生成一个对象，对象有 then 方法", () => {
    const promise = new Promise2(() => {});
    expect(promise.then).toBeTruthy();
  });
  it("new Promise(fn) 中的 fn 会立即被调用", () => {
    const fakeFn = jest.fn();
    new Promise2(fakeFn);
    expect(fakeFn).toHaveBeenCalledTimes(1);
  });
  it("new Promise(fn) 中的 fn 被调用时，会接收到 2 个函数参数", () => {
    const fakeFn = jest.fn();
    new Promise2(fakeFn);
    const [resolve, reject] = fakeFn.mock.calls[0];
    expect(typeof resolve).toBe("function");
    expect(typeof reject).toBe("function");
    expect(fakeFn).toHaveBeenCalledTimes(1);
  });
  it("promise.then(success) 中的 success 会在 Promise resolve 被调用的时候执行", done => {
    const fakeFn = jest.fn();
    const promise = new Promise2((resolve: any) => {
      expect(fakeFn).toHaveBeenCalledTimes(0);
      resolve();
      setTimeout(() => {
        expect(fakeFn).toHaveBeenCalledTimes(1);
        done();
      }, 50);
    });
    promise.then(fakeFn);
  });
  it("promise.then(fail) 中的 fail 会在 Promise reject 被调用的时候执行", done => {
    const fakeFn = jest.fn();
    const promise = new Promise2((resolve: any, reject: any) => {
      expect(fakeFn).toHaveBeenCalledTimes(0);
      reject();
      setTimeout(() => {
        expect(fakeFn).toHaveBeenCalledTimes(1);
        done();
      }, 50);
    });
    promise.then(null, fakeFn);
  });
  it("2.2.1 promise.then 传入的 success 和 fail 必须都是函数，否则忽略", done => {
    const promise = new Promise2((resolve: any, reject: any) => {
      expect(() => {
        resolve();
        setTimeout(() => {
          done();
        }, 50);
      }).not.toThrowError();
    });
    // @ts-ignore
    promise.then("1", "2");
  });
  it("2.2.2 onFulfilled 在 promise 完成后才被调用，并且可以接受到参数", done => {
    const fakeFn = jest.fn();
    const testParams = "123";
    const promise = new Promise2((resolve: any) => {
      expect(fakeFn).toHaveBeenCalledTimes(0);
      resolve(testParams);
      resolve(testParams);
      setTimeout(() => {
        expect(promise.state).toBe("fulfilled");
        expect(fakeFn).toHaveBeenCalledTimes(1);
        expect(fakeFn).toHaveBeenCalledWith(testParams);
        done();
      }, 50);
    });
    promise.then(fakeFn);
  });
  it("2.2.3 onRejected 在 promise 完成后才被调用，并且可以接受到参数", done => {
    const fakeFn = jest.fn();
    const testParams = "123";
    const promise = new Promise2((resolve: any, reject: any) => {
      expect(fakeFn).toHaveBeenCalledTimes(0);
      reject(testParams);
      reject(testParams);
      setTimeout(() => {
        expect(promise.state).toBe("rejected");
        expect(fakeFn).toHaveBeenCalledTimes(1);
        expect(fakeFn).toHaveBeenCalledWith(testParams);
        done();
      }, 50);
    });
    promise.then(null, fakeFn);
  });
  it("2.2.4 在代码执行完之前，onFulfilled 不能被调用", done => {
    const succeed = jest.fn();
    const promise = new Promise2((resolve: any) => {
      resolve();
    });
    promise.then(succeed);
    expect(succeed).toHaveBeenCalledTimes(0);
    setTimeout(() => {
      expect(succeed).toHaveBeenCalledTimes(1);
      done();
    }, 50);
  });
  it("2.2.4 在代码执行完之前，onRejected 不能被调用", done => {
    const fail = jest.fn();
    const promise = new Promise2((resolve: any, reject: any) => {
      reject();
    });
    promise.then(null, fail);
    expect(fail).toHaveBeenCalledTimes(0);
    setTimeout(() => {
      expect(fail).toHaveBeenCalledTimes(1);
      done();
    }, 50);
  });
  it("2.2.5 promise 的 onFulfilled 被调用时，不应该有 this", done => {
    const promise = new Promise2((resolve: any, reject: any) => {
      resolve();
    });
    promise.then(function(this: any) {
      expect(this).toBeUndefined();
      done();
    });
  });
  it("2.2.5 promise 的 onRejected 被调用时，不应该有 this", done => {
    const promise = new Promise2((resolve: any, reject: any) => {
      reject();
    });
    promise.then(null, function(this: any) {
      expect(this).toBeUndefined();
      done();
    });
  });
  it("2.2.6.1 then 传入 onFulfilled 可以在同一个promise里被多次调用", done => {
    const promise = new Promise2((resolve: any) => {
      resolve();
    });
    const callOrderArray: Array<string> = [];
    const fn1 = jest.fn(() => {
      callOrderArray.push("fn1");
    });
    const fn2 = jest.fn(() => {
      callOrderArray.push("fn2");
    });
    const fn3 = jest.fn(() => {
      callOrderArray.push("fn3");
    });
    promise.then(fn1);
    promise.then(fn2);
    promise.then(fn3);
    setTimeout(() => {
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
      expect(fn3).toHaveBeenCalledTimes(1);
      expect(callOrderArray).toEqual(["fn1", "fn2", "fn3"]);
      done();
    }, 50);
  });
  it("2.2.6.2 then 传入 onRejected 可以在同一个promise里被多次调用", done => {
    const promise = new Promise2((resolve: any, reject: any) => {
      reject();
    });
    const callOrderArray: Array<string> = [];
    const fn1 = jest.fn(() => {
      callOrderArray.push("fn1");
    });
    const fn2 = jest.fn(() => {
      callOrderArray.push("fn2");
    });
    const fn3 = jest.fn(() => {
      callOrderArray.push("fn3");
    });
    promise.then(null, fn1);
    promise.then(null, fn2);
    promise.then(null, fn3);
    setTimeout(() => {
      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
      expect(fn3).toHaveBeenCalledTimes(1);
      expect(callOrderArray).toEqual(["fn1", "fn2", "fn3"]);
      done();
    }, 50);
  });
  it("2.2.7 then必须返回一个promise", () => {
    const promise = new Promise2((resolve: any) => {
      resolve();
    });
    const promiseReturnValue = promise.then(() => {}, () => {});
    expect(promiseReturnValue).toBeInstanceOf(Promise2);
  });
  it("2.2.7.1 如果onFulfilled返回一个值x, 运行 [[Resolve]](promise2, x)", done => {
    const promise = new Promise2((resolve: any) => {
      resolve();
    });
    promise
      .then(() => {
        return "123";
      })
      .then((prevResult: any) => {
        expect(prevResult).toBe("123");
        done();
      });
  });
  it("2.3.1 如果promise和 then 的返回值引用同一个对象，则会抛出异常", done => {
    const promise = new Promise2((resolve: any) => {
      resolve();
    });
    const tempPromise = promise.then(() => {
      return tempPromise;
    });
    tempPromise.then(null, (error: any) => {
      expect(error).toBeInstanceOf(TypeError);
      done();
    });
  });
  it("2.3.2.1 如果Promise 成功 onFulfilled 的返回值是一个 promise, 那么返回的 promise 要等这个 promise 结束后，再执行", done => {
    const callOrder: any[] = [];
    const fakeFn1 = jest.fn(() => {
      callOrder.push("fn1");
    });
    const fakeFn2 = jest.fn(() => {
      callOrder.push("fn2");
    });
    const promise = new Promise2((resolve: any) => {
      resolve();
    });
    promise
      .then(() => {
        return new Promise2((resolve: any) => {
          setTimeout(() => {
            fakeFn1();
            resolve();
          }, 20);
        });
      })
      .then(() => {
        fakeFn2();
        expect(callOrder).toEqual(["fn1", "fn2"]);
        done();
      });
  });
  it("2.3.2.1 如果Promise 成功 onRejected 的返回值是一个 promise, 那么返回的 promise 要等这个 promise 结束后，再执行", done => {
    const callOrder: any[] = [];
    const fakeFn1 = jest.fn(() => {
      callOrder.push("fn1");
    });
    const fakeFn2 = jest.fn(() => {
      callOrder.push("fn2");
    });
    const promise = new Promise2((resolve: any) => {
      resolve();
    });
    promise
      .then(() => {
        return new Promise2((resolve: any, reject: any) => {
          setTimeout(() => {
            fakeFn1();
            reject();
          }, 20);
        });
      })
      .then(null, () => {
        fakeFn2();
        expect(callOrder).toEqual(["fn1", "fn2"]);
        done();
      });
  });
  it("2.3.2.1 如果Promise 失败 onFulfilled 的返回值是一个 promise, 那么返回的 promise 要等这个 promise 结束后，再执行", done => {
    const callOrder: any[] = [];
    const fakeFn1 = jest.fn(() => {
      callOrder.push("fn1");
    });
    const fakeFn2 = jest.fn(() => {
      callOrder.push("fn2");
    });
    const promise = new Promise2((resolve: any, reject: any) => {
      reject();
    });
    promise
      .then(null, () => {
        return new Promise2((resolve: any) => {
          setTimeout(() => {
            fakeFn1();
            resolve();
          }, 20);
        });
      })
      .then(() => {
        fakeFn2();
        expect(callOrder).toEqual(["fn1", "fn2"]);
        done();
      });
  });
  it("2.3.2.1 如果Promise 失败 onRejected 的返回值是一个 promise, 那么返回的 promise 要等这个 promise 结束后，再执行", done => {
    const callOrder: any[] = [];
    const fakeFn1 = jest.fn(() => {
      callOrder.push("fn1");
    });
    const fakeFn2 = jest.fn(() => {
      callOrder.push("fn2");
    });
    const promise = new Promise2((resolve: any, reject: any) => {
      reject();
    });
    promise
      .then(null, () => {
        return new Promise2((resolve: any, reject: any) => {
          setTimeout(() => {
            fakeFn1();
            reject();
          }, 20);
        });
      })
      .then(null, () => {
        fakeFn2();
        expect(callOrder).toEqual(["fn1", "fn2"]);
        done();
      });
  });
  it("2.2.7.2 如果onFulfilled抛出一个异常e,promise2 必须被拒绝（rejected）并把e当作原因", done => {
    const fakeFn = jest.fn();
    const promise = new Promise2((resolve: any, reject: any) => {
      resolve();
    });
    promise
      .then(() => {
        throw new Error("test");
      })
      .then(null, (e: any) => {
        fakeFn();
        expect(fakeFn).toHaveBeenCalledTimes(1);
        expect(e.toString()).toContain("test");
        done();
      });
  });
  it("2.2.7.2 如果onRejected抛出一个异常e,promise2 必须被拒绝（rejected）并把e当作原因", done => {
    const fakeFn = jest.fn();
    const promise = new Promise2((resolve: any, reject: any) => {
      reject();
    });
    promise
      .then(null, () => {
        throw new Error("test");
      })
      .then(null, (e: any) => {
        fakeFn();
        expect(fakeFn).toHaveBeenCalledTimes(1);
        expect(e.toString()).toContain("test");
        done();
      });
  });
});
