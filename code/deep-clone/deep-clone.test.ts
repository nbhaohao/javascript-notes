import { deepClone } from "./deep-clone";

describe("深拷贝测试用例", () => {
  it("是一个函数", () => {
    expect(typeof deepClone).toBe("function");
  });
  it("能够复制基本类型", () => {
    const test_number = 2;
    expect(deepClone(test_number)).toEqual(test_number);
    const test_string = "2";
    expect(deepClone(test_string)).toEqual(test_string);
    const test_bool = true;
    expect(deepClone(test_bool)).toEqual(test_bool);
    const test_null = null;
    expect(deepClone(test_null)).toEqual(test_null);
    const test_undefined = undefined;
    expect(deepClone(test_undefined)).toEqual(test_undefined);
    // Symbol 的定义有点模糊
    const test_symbol = Symbol();
    expect(deepClone(test_symbol)).toEqual(test_symbol);
  });
  describe("能够复制对象", () => {
    it("能够复制普通对象", () => {
      const test_obj = {
        name: "zzh",
        age: 1,
        info: { birth: 1996 }
      };
      const clone_obj = deepClone(test_obj);
      expect(clone_obj).not.toBe(test_obj);
      expect(clone_obj).toEqual(test_obj);
      expect(clone_obj.info).not.toBe(test_obj.info);
    });
    it("能够复制数组对象", () => {
      const test_array = [[1, 2], ["1", "2"]];
      const clone_array = deepClone(test_array);
      expect(clone_array).not.toBe(test_array);
      expect(clone_array).toEqual(test_array);
      expect(clone_array[0]).not.toBe(test_array[0]);
      expect(clone_array[1]).not.toBe(test_array[1]);
    });
    it("能够复制函数", () => {
      const test_function = () => {
        return 2;
      };
      test_function.test_prop = "123";
      const clone_function = deepClone(test_function);
      expect(clone_function).not.toBe(test_function);
      expect(clone_function()).toBe(test_function());
      expect(clone_function.test_prop).toEqual(test_function.test_prop);
    });
    it("能够处理环形对象", () => {
      const test_loop: any = { name: "zzh" };
      test_loop.self = test_loop;
      const clone_loop = deepClone(test_loop);
      expect(clone_loop).not.toBe(test_loop);
      expect(clone_loop).toEqual(test_loop);
      expect(clone_loop.self).not.toBe(test_loop.self);
      expect(clone_loop.self).toEqual(test_loop.self);
    });
    it.skip("不能够处理嵌套特别深的对象，会爆栈", () => {
      const test_deep_obj: any = {};
      let temp = test_deep_obj;
      for (let i = 0; i < 20000; i++) {
        temp.child = {};
        temp = temp.child;
      }
      deepClone(test_deep_obj);
    });
    it("可以复制正则表达式", () => {
      const test_reg = /^hi\d$/;
      const clone_reg = deepClone(test_reg);
      expect(clone_reg).not.toBe(test_reg);
      expect(test_reg.source).toBe(clone_reg.source);
      expect(test_reg.flags).toBe(clone_reg.flags);
    });
    it("可以复制日期", () => {
      const test_date = new Date();
      const clone_date = deepClone(test_date);
      expect(clone_date.getTime()).toBe(test_date.getTime());
      expect(clone_date).not.toBe(test_date);
    });
    it("不复制原型链上的属性", () => {
      const test_obj = Object.create({ name: "123" });
      const clone_obj = deepClone(test_obj);
      expect(clone_obj).not.toBe(test_obj);
      expect(clone_obj).toEqual(test_obj);
      expect(test_obj.name).toBe("123");
      expect(clone_obj.name).toBeUndefined();
    });
  });
});
