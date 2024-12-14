import fs from "fs";

const input = fs.readFileSync("./input.txt", "utf8");

export const [leftList, rightList] = input
  .split("\n")
  .map((x) => x.split("  "))
  .reduce(
    ([leftList, rightList], values) => {
      if (values.length < 2) return [leftList, rightList];

      return [leftList.concat(values[0]), rightList.concat(values[1].trim())];
    },
    [[], []],
  );
