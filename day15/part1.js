import { readFileSync } from "node:fs";

const startTime = Date.now();

let { map, moves } = readFileSync("./input.txt", "utf8")
  .trim()
  .split("\n")
  .reduce(
    (acc, val) => {
      if (val === "") return acc;
      if (val[0] === "#") return { ...acc, map: [...acc.map, val.split("")] };
      return { ...acc, moves: [...acc.moves, ...val.split("")] };
    },
    { map: [], moves: [] },
  );

map.map((x) => console.log(x.join("")));
console.log(moves);

const getPosition = {
  "^": ({ x, y }) => ({ x, y: y - 1, pos: map[y - 1][x] }),
  ">": ({ x, y }) => ({ x: x + 1, y, pos: map[y][x + 1] }),
  v: ({ x, y }) => ({ x, y: y + 1, pos: map[y + 1][x] }),
  "<": ({ x, y }) => ({ x: x - 1, y, pos: map[y][x - 1] }),
};

const checkForWall = ({ x, y }, move) => {
  const nextPos = getPosition[move]({ x, y });

  if (nextPos.pos === "#") return true;
  if (nextPos.pos === "O")
    return checkForWall({ x: nextPos.x, y: nextPos.y }, move);
  return false;
};

const moveToPosition = ({ x, y }, pos, move) => {
  const posToMoveTo = getPosition[move]({ x, y });

  if (posToMoveTo.pos === "O")
    moveToPosition({ x: posToMoveTo.x, y: posToMoveTo.y }, "O", move);

  map[posToMoveTo.y][posToMoveTo.x] = pos;

  if (pos === "@") {
    robotPos = {
      x: posToMoveTo.x,
      y: posToMoveTo.y,
    };

    map[y][x] = ".";
  }
};

let robotPos = map.reduce(
  (robotPos, row, y) => {
    const x = row.findIndex((x) => x === "@");

    return x > 0 ? { x, y } : robotPos;
  },
  { x: 0, y: 0 },
);

for (let i = 0; i < moves.length; i++) {
  const move = moves[i];

  const { x, y, pos } = getPosition[move](robotPos);

  if (pos === "#") continue;
  if (pos === "O") {
    const isBlocked = checkForWall({ x, y }, move);

    if (isBlocked) continue;
  }

  moveToPosition(robotPos, "@", move);
}

const sum = map.reduce((sum, row, y) => {
  return (
    sum +
    row.reduce(
      (rowSum, pos, x) => (pos === "O" ? rowSum + (100 * y + x) : rowSum),
      0,
    )
  );
}, 0);

console.log(sum);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
