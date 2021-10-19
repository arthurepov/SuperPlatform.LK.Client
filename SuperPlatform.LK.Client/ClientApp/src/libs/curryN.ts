/* eslint-disable */
export default function (arity, fn) {
  return function curried() {
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    if (args.length >= arity) {
      return fn.apply(this, args);
    }

    return function () {
      for (
        var _len2 = arguments.length, newArgs = new Array(_len2), _key2 = 0;
        _key2 < _len2;
        _key2++
      ) {
        newArgs[_key2] = arguments[_key2];
      }

      return curried.apply(this, args.concat(newArgs));
    };
  };
}
