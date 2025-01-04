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

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    const tile = map[i][j];
    let wideTile = {
      "#": ["#", "#"],
      O: ["[", "]"],
      ".": [".", "."],
      "@": ["@", "."],
    }[tile];
    map[i][j] = wideTile;
  }
}

let wideMap = map.map((x) => x.flat());

const getPosition = {
  "^": ({ x, y }) => ({ x, y: y - 1, pos: wideMap[y - 1][x] }),
  ">": ({ x, y }) => ({ x: x + 1, y, pos: wideMap[y][x + 1] }),
  v: ({ x, y }) => ({ x, y: y + 1, pos: wideMap[y + 1][x] }),
  "<": ({ x, y }) => ({ x: x - 1, y, pos: wideMap[y][x - 1] }),
};

const checkForWall = ({ x, y, pos }, move) => {
  if (pos === "#") return true;
  if (move === "^") {
    if (pos === "[") {
      return (
        checkForWall({ x, y: y - 1, pos: wideMap[y - 1][x] }, move) ||
        checkForWall({ x: x + 1, y: y - 1, pos: wideMap[y - 1][x + 1] }, move)
      );
    }
    if (pos === "]") {
      return (
        checkForWall({ x, y: y - 1, pos: wideMap[y - 1][x] }, move) ||
        checkForWall({ x: x - 1, y: y - 1, pos: wideMap[y - 1][x - 1] }, move)
      );
    }
  }
  if (move === ">" && (pos === "[" || pos === "]")) {
    return checkForWall({ x: x + 1, y, pos: wideMap[y][x + 1] }, move);
  }
  if (move === "v") {
    if (pos === "[") {
      return (
        checkForWall({ x, y: y + 1, pos: wideMap[y + 1][x] }, move) ||
        checkForWall({ x: x + 1, y: y + 1, pos: wideMap[y + 1][x + 1] }, move)
      );
    }
    if (pos === "]") {
      return (
        checkForWall({ x, y: y + 1, pos: wideMap[y + 1][x] }, move) ||
        checkForWall({ x: x - 1, y: y + 1, pos: wideMap[y + 1][x - 1] }, move)
      );
    }
  }
  if (move === "<" && (pos === "[" || pos === "]")) {
    return checkForWall({ x: x - 1, y, pos: wideMap[y][x - 1] }, move);
  }

  return false;
};

const moveToPosition = ({ x, y }, pos, move) => {
  const posToMoveTo = getPosition[move]({ x, y });

  if (move === "^") {
    if (posToMoveTo.pos === "[") {
      moveToPosition({ x, y: y - 1 }, "[", move);
      moveToPosition({ x: x + 1, y: y - 1 }, "]", move);
    } else if (posToMoveTo.pos === "]") {
      moveToPosition({ x, y: y - 1 }, "]", move);
      moveToPosition({ x: x - 1, y: y - 1 }, "[", move);
    }
  } else if (move === ">" && posToMoveTo.pos === "[") {
    moveToPosition({ x: x + 2, y }, "]", move);
    moveToPosition({ x: x + 1, y }, "[", move);
  } else if (move === "v") {
    if (posToMoveTo.pos === "[") {
      moveToPosition({ x, y: y + 1 }, "[", move);
      moveToPosition({ x: x + 1, y: y + 1 }, "]", move);
    } else if (posToMoveTo.pos === "]") {
      moveToPosition({ x, y: y + 1 }, "]", move);
      moveToPosition({ x: x - 1, y: y + 1 }, "[", move);
    }
  } else if (move === "<" && posToMoveTo.pos === "]") {
    moveToPosition({ x: x - 2, y }, "[", move);
    moveToPosition({ x: x - 1, y }, "]", move);
  }

  wideMap[posToMoveTo.y][posToMoveTo.x] = pos;

  if (pos === "[" || pos === "]") {
    wideMap[y][x] = ".";
  }

  if (pos === "@") {
    robotPos = {
      x: posToMoveTo.x,
      y: posToMoveTo.y,
    };

    wideMap[y][x] = ".";
  }
};

let robotPos = wideMap.reduce(
  (robotPos, row, y) => {
    const x = row.findIndex((x) => x === "@");

    return x !== -1 ? { x, y } : robotPos;
  },
  { x: 0, y: 0 },
);

for (let i = 0; i < moves.length; i++) {
  const move = moves[i];

  const { x, y, pos } = getPosition[move](robotPos);

  if (pos === "#") continue;
  if (pos === "[" || pos === "]") {
    const isBlocked = checkForWall({ x, y, pos }, move);

    if (isBlocked) continue;
  }

  moveToPosition(robotPos, "@", move);
  wideMap.map((x) => console.log(x.join("")));
}

const sum = wideMap.reduce((sum, row, y) => {
  return (
    sum +
    row.reduce(
      (rowSum, pos, x) => (pos === "[" ? rowSum + (100 * y + x) : rowSum),
      0,
    )
  );
}, 0);

console.log(sum);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
