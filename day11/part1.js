import { readFileSync } from "node:fs";

const startTime = Date.now();

const input = readFileSync("./input.txt", "utf8").trim().split(" ");

const transform = (digit) => {
  if (digit === "0") return "1";
  if (digit.length % 2 === 0)
    return [
      `${+digit.slice(0, digit.length / 2)}`,
      `${+digit.slice(digit.length / 2, digit.length)}`,
    ];
  return `${+digit * 2024}`;
};

let stones = [...input.map((x) => x)];
for (let i = 0; i < 25; i++) {
  stones = stones.flatMap(transform);
}

console.log(stones.map((x) => x).length);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
