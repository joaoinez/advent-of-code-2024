import { readFileSync } from "node:fs";

const startTime = Date.now();

const input = readFileSync("./input.txt", "utf8").split("\n");

const slicedInput = input.slice(0, input.length - 1);

slicedInput.map((x) => console.log(x));

const antennas = slicedInput.reduce((antennas, row, y) => {
  row.split("").map((node, x) => {
    if (node !== ".") {
      const frequency = antennas[node];

      if (!frequency) {
        antennas[node] = [{ x, y }];
      } else {
        antennas[node].push({ x, y });
      }
    }
  });

  return antennas;
}, {});

console.log(antennas);

let antiNodes = [];

// for (var i = 0; i < xs.length; i++) { console.log(xs[i]); }
Object.keys(antennas).map((frequency) => {
  const frequencyAntennas = antennas[frequency];

  frequencyAntennas.map((antenna, i) => {
    if (i === frequencyAntennas.length - 1) return;

    const otherAntennas = frequencyAntennas.slice(
      i + 1,
      frequencyAntennas.length,
    );

    otherAntennas.map((otherAntenna) => {
      const distance = {
        x: antenna.x - otherAntenna.x,
        y: antenna.y - otherAntenna.y,
      };

      console.log(distance);

      const newAntiNodes = [
        {
          x: antenna.x - distance.x * 2,
          y: antenna.y - distance.y * 2,
        },
        {
          x: otherAntenna.x + distance.x * 2,
          y: otherAntenna.y + distance.y * 2,
        },
      ];

      newAntiNodes.map(({ x, y }) => {
        if (
          x < 0 ||
          x > slicedInput[0].length - 1 ||
          y < 0 ||
          y > slicedInput.length - 1
        )
          return;

        !~antiNodes.findIndex(({ x: _x, y: _y }) => x === _x && y === _y) &&
          antiNodes.push({ x, y });
      });
    });
  });
});

let map = slicedInput.map((row) => row.split("").map((x) => x));

antiNodes.map(({ x, y }) => (map[y][x] = "#"));

map.map((n) => console.log(n.join("")));

console.log(antiNodes.length);

console.log(`\nCompleted in ${Date.now() - startTime}ms`);
