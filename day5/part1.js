import { createReadStream, readFileSync } from "node:fs";

const updates = readFileSync("./updates.txt", "utf8");

const stream = createReadStream("./rules.txt");

let chunks = "";

// test

stream.on("data", (chunk) => {
  chunks += chunk.toString();
});

stream.on("end", () => {
  const rules = chunks.split("\n").reduce((acc, value) => {
    if (!value.length) return acc;

    const [left, right] = value.split("|");
    const rules = acc[left];

    return rules
      ? { ...acc, [left]: [...rules, right] }
      : { ...acc, [left]: [right] };
  }, {});

  const correctUpdates = updates.split("\n");
});
