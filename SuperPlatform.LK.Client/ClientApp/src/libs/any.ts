import curryN from './curryN';

export default curryN(2, function (fn, obj = {}) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, key) &&
      fn(obj[key], key, obj)
    ) {
      return true;
    }
  }

  return false;
});
