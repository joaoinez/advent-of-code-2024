import { readFileSync } from "node:fs";

const startTime = Date.now();

const input = readFileSync("./input.txt", "utf8")
  .trim()
  .split("\n")
  .map((val) => {
    const [, p, v] = val.match(
      /p=([+-]?\d+,[+-]?\d+) v=([+-]?\d+,[+-]?\d+)/,
    ) ?? [null, null, null];

    const [px, py] = p.split(",");
    const [vx, vy] = v.split(",");

    return { p: { x: +px, y: +py }, v: { x: +vx, y: +vy } };
  });

const dimensions = { w: 101, t: 103 };

let positions = [];
for (let i = 0; i < input.length; i++) {
  const robot = input[i];

  let pos = { x: robot.p.x, y: robot.p.y };
  for (let k = 0; k < 100; k++) {
    pos = {
      x: (((pos.x + robot.v.x) % dimensions.w) + dimensions.w) % dimensions.w,
      y: (((pos.y + robot.v.y) % dimensions.t) + dimensions.t) % dimensions.t,
    };
  }

  positions.push(pos);
}

let map = [];
for (let i = 0; i < dimensions.t; i++) {
  let row = [];
  for (let j = 0; j < dimensions.w; j++) {
    row.push(".");
  }
  map.push(row);
}

for (let i = 0; i < positions.length; i++) {
  const pos = positions[i];
  const mapPos = map[pos.y][pos.x];

  map[pos.y][pos.x] = mapPos === "." ? 1 : mapPos + 1;
}

map.map((x) => console.log(x.join("")));

const quadrant1 = map
  .filter((_, i) => i < Math.round(dimensions.t / 2) - 1)
  .map((x) => x.filter((_, i) => i < Math.round(dimensions.w / 2) - 1));

const quadrant2 = map
  .filter((_, i) => i < Math.round(dimensions.t / 2) - 1)
  .map((x) => x.filter((_, i) => i >= Math.round(dimensions.w / 2)));

const quadrant3 = map
  .filter((_, i) => i >= Math.round(dimensions.t / 2))
  .map((x) => x.filter((_, i) => i < Math.round(dimensions.w / 2) - 1));

const quadrant4 = map
  .filter((_, i) => i >= Math.round(dimensions.t / 2))
  .map((x) => x.filter((_, i) => i >= Math.round(dimensions.w / 2)));

const safety = [quadrant1, quadrant2, quadrant3, quadrant4].reduce(
  (safety, quadrant) => {
    const quadrantSafety = quadrant.reduce((quadrantSafety, row) => {
      const rowSafety = row.reduce((rowSafety, value) => {
        return rowSafety + (value === "." ? 0 : value);
      }, 0);

      return quadrantSafety + rowSafety;
    }, 0);
    return safety * quadrantSafety;
  },
  1,
);

console.log(safety);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
