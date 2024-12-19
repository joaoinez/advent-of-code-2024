import { readFileSync } from "node:fs";

const input = readFileSync("./test.txt", "utf8").split("\n");

const map = input.slice(0, input.length - 1).map((x) => x.split(""));

const startingPos = map.reduce(
  (pos, row, i) => {
    const xPos = row.findIndex((x) => x === "^");

    return xPos > 0 ? { x: xPos, y: i } : pos;
  },
  { x: null, y: null },
);

const patrol = (_map, { x, y }, dir) => {
  let patrolledMap = [..._map];
  patrolledMap[y][x] = "X";

  const inFront = {
    up: (map) => (y - 1 >= 0 ? map[y - 1][x] : "e"),
    right: (map) => (x + 1 < map[y].length ? map[y][x + 1] : "e"),
    down: (map) => (y + 1 < map.length ? map[y + 1][x] : "e"),
    left: (map) => (x - 1 >= 0 ? map[y][x - 1] : "e"),
  }[dir](_map);

  const turn = {
    up: "right",
    right: "down",
    down: "left",
    left: "up",
  };

  if (inFront === "e") return patrolledMap;

  const nextPos = {
    up: { x, y: y - 1 },
    right: { x: x + 1, y },
    down: { x, y: y + 1 },
    left: { x: x - 1, y },
  };

  if (inFront === "#") {
    return patrol(patrolledMap, nextPos[turn[dir]], turn[dir]);
  }

  return patrol(patrolledMap, nextPos[dir], dir);
};

const patrolledMap = patrol(map, startingPos, "up");

console.log(patrolledMap.flatMap((x) => x).filter((x) => x === "X").length);
