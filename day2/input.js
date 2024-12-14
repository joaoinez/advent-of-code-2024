import fs from "fs";

const input = fs.readFileSync("./input.txt", "utf8");

const reports = input
  .split("\n")
  .reduce((acc, val) => (val.length ? acc.concat([val.split(" ")]) : acc), []);

export default reports;
