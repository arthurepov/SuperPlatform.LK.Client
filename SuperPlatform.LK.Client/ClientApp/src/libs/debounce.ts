import curryN from './curryN';

export default curryN(2, function (wait, fn) {
  let timeout;

  function f(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias,no-underscore-dangle
    const _this = this;

    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(
      function () {
        return fn.apply(_this, args);
      }, // eslint-disable-line prefer-rest-params
      wait
    );
  }

  f.cancel = function () {
    return clearTimeout(timeout);
  };

  return f;
});
