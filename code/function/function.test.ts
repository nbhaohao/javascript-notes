import {
  fac,
  fac_updated,
  fac_loop,
  memo,
  add,
  add_curried,
  addThree,
  addThree_curried,
  currify
} from "./function";
describe("测试 function 的函数", () => {
  const util_test_fac = fn => {
    expect(fn(1)).toBe(1);
    expect(fn(2)).toBe(2);
    expect(fn(3)).toBe(6);
    expect(fn(4)).toBe(24);
    expect(fn(5)).toBe(120);
  };

  it("测试没有优化过的阶乘", () => {
    util_test_fac(fac);
  });
  it("测试尾递归优化过的阶乘", () => {
    util_test_fac(fac_updated);
  });
  it("测试循环版阶乘", () => {
    util_test_fac(fac_loop);
  });
  it("测试 memo 函数", () => {
    const fnTest = jest.fn(x => x);
    const memo_fnTest = memo(fnTest);
    memo_fnTest(5);
    expect(fnTest.mock.results[0].value).toBe(5);
    expect(memo_fnTest(5)).toBe(5);
    expect(fnTest).toHaveBeenCalledTimes(1);
  });
  it("测试柯里化", () => {
    expect(add(1, 2)).toBe(add_curried(1)(2));
    expect(addThree(1, 2, 3)).toBe(addThree_curried(1)(2)(3));
  });
  it("测试把任意函数柯里化", () => {
    const fnTest = jest.fn((a, b, c) => a + b + c);
    const currify_fnTest = currify(fnTest);
    expect(currify_fnTest(0)(1)(2)).toBe(3);
    expect(currify_fnTest(0, 1)(2)).toBe(3);
  });
});
