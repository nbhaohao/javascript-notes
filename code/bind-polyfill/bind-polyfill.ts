// 因为当前环境下连 bind 都没有，所以不能用 ... 或者 const 的语法
function bindPolyfill(this: Function, thisArg: any): any {
  var fn = this;
  var slice = Array.prototype.slice;
  var args = slice.call(arguments, 1);
  return function() {
    var newArgs = slice.call(arguments, 0);
    return fn.apply(thisArg, args.concat(newArgs));
  };
}

// 使用 es6 语法更方便的写法
function bindPolyfill_es6(
  this: Function,
  thisArg: any,
  ...argArray: any[]
): any {
  const fn = this;
  return function(this: any, ...args: Array<any>): any {
    return fn.call(thisArg, ...argArray, ...args);
  };
}

if (!Function.prototype.bind) {
  Function.prototype.bind = bindPolyfill;
}
export { bindPolyfill, bindPolyfill_es6 };
