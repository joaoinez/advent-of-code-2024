import { readFileSync } from "node:fs";

const startTime = Date.now();

let positions = readFileSync("./input.txt", "utf8")
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

for (let k = 1; k <= 15000; k++) {
  for (let i = 0; i < positions.length; i++) {
    const robot = positions[i];
    positions[i] = {
      p: {
        x:
          (((robot.p.x + robot.v.x) % dimensions.w) + dimensions.w) %
          dimensions.w,
        y:
          (((robot.p.y + robot.v.y) % dimensions.t) + dimensions.t) %
          dimensions.t,
      },
      v: robot.v,
    };
  }

  let map = [];
  for (let i = 0; i < dimensions.t; i++) {
    let row = [];
    for (let j = 0; j < dimensions.w; j++) {
      row.push(" ");
    }
    map.push(row);
  }

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i].p;

    map[pos.y][pos.x] = "󰝤";
  }

  const border = map.some((row) => row.join("").includes("󰝤󰝤󰝤󰝤󰝤󰝤󰝤󰝤󰝤󰝤󰝤󰝤"));
  if (border) {
    console.log("Second: " + k);
    map.map((x) => console.log(x.join("")));
  }
}

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
