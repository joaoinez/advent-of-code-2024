import { leftList, rightList } from "./input.js";

const value = leftList.reduce((value, elem) => {
  const found = rightList.filter((x) => x === elem);

  return value + elem * found.length;
}, 0);

console.log(value);
