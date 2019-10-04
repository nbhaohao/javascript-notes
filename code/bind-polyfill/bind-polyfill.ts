// 因为当前环境下连 bind 都没有，所以不能用 ... 或者 const 的语法
function bindPolyfill(this: Function, thisArg: any): any {
  var fn = this;
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);
  function temp(this: any) {
    var newArgs = slice.call(arguments, 0);
    return fn.apply(
      this instanceof temp ? this : thisArg,
      args.concat(newArgs)
    );
  }
  temp.prototype = fn.prototype;
  return temp;
}

// 使用 es6 语法更方便的写法
// this instanceof temp 是为了让我们返回的函数可以被 new.
// 因为 new 操作符会传入一个临时对象作为 this, 在这种情况下，我们应该使用原本的 this
// 那为了判断当前函数是否是通过 new 操作符调用的，我们就看当前 this instanceof temp.
function bindPolyfill_es6(
  this: Function,
  thisArg: any,
  ...argArray: any[]
): any {
  const fn = this;
  function temp(this: any, ...args: Array<any>): any {
    return fn.call(this instanceof temp ? this : thisArg, ...argArray, ...args);
  }
  temp.prototype = fn.prototype;
  return temp;
}

if (!Function.prototype.bind) {
  Function.prototype.bind = bindPolyfill;
}
export { bindPolyfill, bindPolyfill_es6 };
