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

// console.log(blocksMap.join(""));

let blocks = [];
for (let i = 0; i < blocksMap.length; i++) {
  const char = blocksMap[i];
  const nextChar = i + 1 < blocksMap.length - 1 ? blocksMap[i + 1] : null;
  const prevBlockChar = blocks.length ? blocks[blocks.length - 1].char : null;

  if (char !== ".") {
    const isBlockEnd = char !== nextChar;
    const isNewBlock = char !== prevBlockChar;

    if (isNewBlock)
      blocks.push({ char, startPos: i, endPos: isBlockEnd ? i : null });
    else {
      blocks[blocks.length - 1] = {
        char,
        startPos: blocks[blocks.length - 1].startPos,
        endPos: isBlockEnd ? i : null,
      };
    }
  }
}

// console.log(blocks);

for (let i = blocks.length - 1; i >= 0; i--) {
  const file = blocks[i];
  const fileLength = file.endPos - file.startPos + 1;

  let emptyBlockStart = null;
  for (let j = 0; j < file.startPos; j++) {
    const prevChar = j - 1 >= 0 ? blocksMap[j - 1] : null;
    const char = blocksMap[j];
    const nextChar = j + 1 < blocksMap.length ? blocksMap[j + 1] : null;

    if (char === ".") {
      if (prevChar !== ".") {
        emptyBlockStart = j;
      }
      if (nextChar !== ".") {
        const emptyBlockLength = j - emptyBlockStart + 1;

        if (emptyBlockLength >= fileLength) {
          for (
            let k = emptyBlockStart;
            k <= emptyBlockStart + fileLength - 1;
            k++
          ) {
            blocksMap[k] = file.char;
          }
          for (let k = file.startPos; k <= file.endPos; k++) {
            blocksMap[k] = ".";
          }

          break;
        }

        emptyBlockStart = null;
      }
    }
  }
}

const checksum = blocksMap.reduce(
  (acc, val, i) => (val !== "." ? acc + +val * i : acc),
  0,
);

console.log(checksum);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
