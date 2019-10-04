import { bindPolyfill, bindPolyfill_es6 } from "./bind-polyfill";

// 用于测试，因为 Function.prototype.bind 覆盖不掉
declare global {
  interface Function {
    bind2: any;
  }
}

describe("测试 bind-polyfill", () => {
  beforeAll(() => {
    // Function.prototype.bind2 = bindPolyfill_es6;
    Function.prototype.bind2 = bindPolyfill;
  });
  it("普通函数上存在 bindPolyFill", () => {
    const fn = () => {};
    // expect(fn.bind2).toBe(bindPolyfill_es6);
    expect(fn.bind2).toBe(bindPolyfill);
  });
  it("可以将第一个参数作为新函数调用的 this", () => {
    const test_fn = function(this: any): any {
      return this;
    };
    const test_obj = { name: "123" };
    const new_test_fn = test_fn.bind2(test_obj);
    expect(new_test_fn()).toBe(test_obj);
  });
  it("可以传递任意参数给原始函数", () => {
    const test_fn1 = function(this: any, a: any, b: any) {
      return [this, a, b];
    };
    const new_test_fn1 = test_fn1.bind2(undefined, "1", "2");
    expect(new_test_fn1()).toEqual([undefined, "1", "2"]);
  });
  it("可以在调用时传递参数", () => {
    const test_fn1 = function(this: any, a: any, b: any) {
      return [this, a, b];
    };
    const new_test_fn1 = test_fn1.bind2(undefined, "1");
    expect(new_test_fn1(2)).toEqual([undefined, "1", 2]);
    const new_test_fn2 = test_fn1.bind2(undefined);
    expect(new_test_fn2(1, 2)).toEqual([undefined, 1, 2]);
  });
});
