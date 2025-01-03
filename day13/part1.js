import { readFileSync } from "node:fs";

const startTime = Date.now();

const [input] = readFileSync("./input.txt", "utf8")
  .trim()
  .split("\n")
  .reduce(
    (acc, val) => {
      if (val === "") return acc;

      const [configs, curConfig] = acc;

      if (val.includes("Button A")) {
        const [, x, y] = val.match(/X\+(\d+), Y\+(\d+)/) ?? [null, null, null];

        return [configs, { ...curConfig, a: { x: +x, y: +y } }];
      } else if (val.includes("Button B")) {
        const [, x, y] = val.match(/X\+(\d+), Y\+(\d+)/) ?? [null, null, null];

        return [configs, { ...curConfig, b: { x: +x, y: +y } }];
      } else if (val.includes("Prize")) {
        const [, x, y] = val.match(/X=(\d+), Y=(\d+)/) ?? [null, null, null];
        const config = {
          ...curConfig,
          prize: { x: +x + 10000000000000, y: +y + 10000000000000 },
        };

        configs.push(config);

        return [configs, {}];
      }
      return acc;
    },
    [[], {}],
  );

const tokens = input.reduce((tokens, config) => {
  // Ax * a + Bx * b = Px
  // Ax * a = Px - Bx * b
  // a = (Px - Bx * b) / Ax
  //
  // Ay * a + By * b = Py
  // Ay * (Px - Bx * b) / Ax + By * b = Py
  // b = (Py - Ay * Px / Ax) / (-Ay * Bx / Ax + By)

  const b =
    (config.prize.y - (config.a.y * config.prize.x) / config.a.x) /
    ((-config.a.y * config.b.x) / config.a.x + config.b.y);
  const a = (config.prize.x - config.b.x * b) / config.a.x;

  if (
    config.a.x * Math.round(a) + config.b.x * Math.round(b) ===
      config.prize.x &&
    config.a.y * Math.round(a) + config.b.y * Math.round(b) === config.prize.y
  ) {
    return tokens + Math.round(a) * 3 + Math.round(b);
  }

  return tokens;
}, 0);

console.log(tokens);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
