import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").split("\n");

const equations = input.slice(0, input.length - 1);

const sanitizedEquations = equations.map((equation) => {
  const [result, values] = equation.split(":");

  const trimmedValues = values
    .trim()
    .split(" ")
    .map((x) => +x);

  return { result: +result, values: trimmedValues };
});

const operation = (symbol, num1, num2) =>
  symbol === "+"
    ? num1 + num2
    : symbol === "*"
      ? num1 * num2
      : symbol === "|"
        ? +`${num1}${num2}`
        : 0;

const test = (result, acc, values, index) => {
  if (acc > result) return false;
  if (index === values.length - 1) return acc === result;

  const add = operation("+", acc, values[index + 1]);
  const mult = operation("*", acc, values[index + 1]);
  const concat = operation("|", acc, values[index + 1]);

  return (
    test(result, add, values, index + 1) ||
    test(result, mult, values, index + 1) ||
    test(result, concat, values, index + 1)
  );
};

const sum = sanitizedEquations.reduce((sum, { result, values }) => {
  const found = test(result, values[0], values, 0);

  return found ? sum + result : sum;
}, 0);

console.log(sum);
