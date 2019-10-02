// 阶乘递归
export const fac = (n: number): number => {
  if (n === 1) {
    return 1;
  }
  return n * fac(n - 1);
};

// 阶乘尾递归优化
const calc_fac = (start: number, end: number, result: number): number => {
  if (start === end) {
    return result;
  }
  const newStart = start + 1;
  return calc_fac(newStart, end, newStart * result);
};

// 调用阶乘尾递归
export const fac_updated = (n: number): number => {
  return calc_fac(1, n, 1);
};

// 循环版的递归
export const fac_loop = (n: number) => {
  const result: Array<number> = [1];
  for (let i = 1; i <= n; i++) {
    if (i === n) {
      return result[i - 1];
    }
    result.push((i + 1) * result[i - 1]);
  }
};

// 记忆化函数 (这里用第一个参数作为 key 只是方便演示，真实情况下可能需要 equal 所有参数)
export const memo = fn => {
  const memorize = function(key, ...args) {
    if (!(key in memorize.cache)) {
      memorize.cache[key] = fn.apply(this, [key, ...args]);
    }
    return memorize.cache[key];
  };
  memorize.cache = {};
  return memorize;
};

// 柯里化函数
export const add = (a, b) => a + b;
export const add_curried = a => b => a + b;
export const addThree = (a, b, c) => a + b + c;
export const addThree_curried = a => b => c => a + b + c;

export const currify = (fn, params = []) => {
  return (...args) => {
    if (args.length + params.length === fn.length) {
      return fn(...params, ...args);
    }
    return currify(fn, [...params, ...args]);
  };
};
