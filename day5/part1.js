import { createReadStream, readFileSync } from "node:fs";

const updates = readFileSync("./updates.txt", "utf8");
const stream = createReadStream("./rules.txt");
let chunks = "";

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

  const correctUpdatesValue = updates.split("\n").reduce((acc, update) => {
    const updateArray = update.split(",");

    const isCorrect = updateArray.reduce((result, pageNumber, index, array) => {
      if (!result) return result;
      if (index === 0) {
        return result;
      }
      if (!pageNumber) return result;

      const pages = rules[pageNumber];

      if (!pages) return result;

      const previousValues = array.slice(0, index);

      const isBreakingRule = previousValues.some((value) =>
        pages.includes(value),
      );

      return isBreakingRule ? false : result;
    }, true);

    if (isCorrect) {
      const middleIndex = Math.floor(updateArray.length / 2);

      return acc + +updateArray[middleIndex];
    }

    return acc;
  }, 0);

  console.log(correctUpdatesValue);
});
