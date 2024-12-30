import { readFileSync } from "node:fs";

const startTime = Date.now();

const input = readFileSync("./input.txt", "utf8").trim();

let blocksMap = input.split("").reduce((blocksMap, val, index) => {
  let blocks = [];
  for (let i = 0; i < val; i++) {
    blocks.push(index % 2 ? "." : index / 2);
  }

  return blocksMap.concat(blocks);
}, []);

for (let i = 0; i < blocksMap.length; i++) {
  if (blocksMap[i] === ".") {
    const index = blocksMap.findLastIndex((x) => x !== "." && x !== "X");
    const char = blocksMap.findLast((x) => x !== "." && x !== "X");

    blocksMap[index] = "X";
    blocksMap[i] = char;
  }
}

const updated = blocksMap.filter((x) => x !== "X");

const checksum = updated.reduce(
  (acc, val, i) => (val !== "." ? acc + +val * i : acc),
  0,
);

console.log(checksum);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
