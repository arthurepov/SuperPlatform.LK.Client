export const declensionOfNumber = (num: number, titles: string[]): string => {
  const cases = [2, 0, 1, 1, 1, 2];

  // eslint-disable-next-line no-magic-numbers
  return titles[
    num % 100 > 4 && num % 100 < 20 ? 2 : cases[num % 10 < 5 ? num % 10 : 5]
  ];
};
