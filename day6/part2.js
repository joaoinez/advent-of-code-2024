import { readFileSync } from "node:fs";

const input = readFileSync("./input.txt", "utf8").split("\n");

const map = input.slice(0, input.length - 1).map((x) => x.split(""));

const rows = map.length;

const cols = map[0].length;

const startingPos = map.reduce(
  (pos, row, i) => {
    const xPos = row.findIndex((x) => x === "^");

    return xPos > 0 ? { x: xPos, y: i } : pos;
  },
  { x: null, y: null },
);
