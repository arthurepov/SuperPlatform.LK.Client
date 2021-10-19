import curryN from './curryN';

export default curryN(3, function (fn, acc, arr = []) {
  const len = arr.length;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < len; i++) {
    // eslint-disable-next-line no-param-reassign
    acc = fn(acc, arr[i], i, arr);
  }

  return acc;
}) as any;
