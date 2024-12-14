import input from "./input.js";

const matched = input
  .match(/mul\((\d{1,3}),(\d{1,3})\)/g)
  .map((x) => x.match(/(\d+),(\d+)/g));

const value = matched.reduce((acc, [val]) => {
  const [n1, n2] = val.split(",");

  const mul = +n1 * +n2;

  return acc + mul;
}, 0);

console.log(value);
