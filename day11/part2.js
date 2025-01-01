import { readFileSync } from "node:fs";

const startTime = Date.now();

const input = readFileSync("./input.txt", "utf8").trim().split(" ");

const transform = (digit) => {
  if (digit === "0") return ["1"];
  if (digit.length % 2 === 0)
    return [
      `${+digit.slice(0, digit.length / 2)}`,
      `${+digit.slice(digit.length / 2, digit.length)}`,
    ];
  return [`${+digit * 2024}`];
};

const blink = (digit, times) => {
  if (times === 0) return 1;

  const key = `${digit},${times}`;
  const cached = cache[key];

  if (cached) return cached;

  const created = transform(digit);

  let createdStones = 0;
  for (let i = 0; i < created.length; i++) {
    createdStones += blink(created[i], times - 1);
  }

  cache[key] = createdStones;

  return createdStones;
};

let cache = {};
let stones = 0;
for (let i = 0; i < input.length; i++) {
  const createdStones = blink(input[i], 75);

  stones += createdStones;
}

console.log(stones);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
