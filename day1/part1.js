import { leftList, rightList } from "./input.js";

const orderedLeft = leftList.sort();
const orderedRight = rightList.sort();

const value = orderedLeft.reduce((value, elem, i) => {
  const sum = elem - orderedRight[i];

  const positiveSum = sum < 0 ? sum * -1 : sum;

  return value + positiveSum;
}, 0);

console.log(value);
