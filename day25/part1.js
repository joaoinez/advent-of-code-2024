import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").split("\n");

const { schematics } = input.reduce(
  ({ schematics, index }, row) => {
    if (!row.length) return { schematics, index: index + 1 };

    schematics[index] = schematics[index] ? [...schematics[index], row] : [row];

    return { schematics, index };
  },
  { schematics: [], index: 0 },
);

const { locks, keys } = schematics.reduce(
  ({ locks, keys }, schematic) => {
    const isLock = schematic[0][0] === "#";

    if (isLock) {
      const heights = schematic.reduce(
        (heights, row, i) => {
          if (i === 0) return heights;

          const weights = row.split("").map((pin) => (pin === "#" ? 1 : 0));

          return heights.map((value, i) => value + weights[i]);
        },
        [0, 0, 0, 0, 0],
      );

      locks.push(heights);
    } else {
      const heights = schematic.reverse().reduce(
        (heights, row, i) => {
          if (i === 0) return heights;

          const weights = row.split("").map((pin) => (pin === "#" ? 1 : 0));

          return heights.map((value, i) => value + weights[i]);
        },
        [0, 0, 0, 0, 0],
      );

      keys.push(heights);
    }

    return { locks, keys };
  },
  { locks: [], keys: [] },
);

const pairs = locks.reduce((pairs, lock) => {
  const matched = keys.reduce((matched, key) => {
    return lock.every((pin, i) => {
      return pin + key[i] <= 5;
    })
      ? matched + 1
      : matched;
  }, 0);

  return pairs + matched;
}, 0);

console.log(pairs);
