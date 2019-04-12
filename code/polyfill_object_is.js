/*
    由于 Object.js 总是存在，所以使用 || true
    主要思路是：判断这个值是不是 NaN, -0, 0,
    如果不是这 3 种情况，我们都可以使用 === 来判断
*/
if (!Object.is || true) {
  const fakeIsNaN = value => value !== value; // 判断值是不是 NaN
  const fakeIsNavigateZero = value => value === 0 && 1 / value === -Infinity; // 判断值是不是 -0
  const fakeIsZero = value => value === 0 && 1 / value === Infinity; // 判断值是不是 0
  Object.is = (a, b) => {
    if (fakeIsNaN(a)) {
      return fakeIsNaN(b);
    }
    if (fakeIsNavigateZero(a)) {
      return fakeIsNavigateZero(b);
    }
    if (fakeIsZero(a)) {
      return fakeIsZero(b);
    }
    return a === b;
  };
}

// tests:
console.log(Object.is(42, 42) === true);
console.log(Object.is("foo", "foo") === true);
console.log(Object.is(false, false) === true);
console.log(Object.is(null, null) === true);
console.log(Object.is(undefined, undefined) === true);
console.log(Object.is(NaN, NaN) === true);
console.log(Object.is(-0, -0) === true);
console.log(Object.is(0, 0) === true);

console.log(Object.is(-0, 0) === false);
console.log(Object.is(0, -0) === false);
console.log(Object.is(0, NaN) === false);
console.log(Object.is(NaN, 0) === false);
console.log(Object.is(42, "42") === false);
console.log(Object.is("42", 42) === false);
console.log(Object.is("foo", "bar") === false);
console.log(Object.is(false, true) === false);
console.log(Object.is(null, undefined) === false);
console.log(Object.is(undefined, null) === false);
