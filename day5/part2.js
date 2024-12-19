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

    if (!isCorrect) {
      const corrected = updateArray.reduce((correctedArray, pageNumber, i) => {
        if (i === 0) return [pageNumber];
        if (!pageNumber) return correctedArray;

        const pages = rules[pageNumber];

        if (!pages) return [...correctedArray, pageNumber];

        const prevPages = correctedArray.slice(0, i);

        const brokenRuleIndex = prevPages.findIndex((value) =>
          pages.includes(value),
        );

        if (brokenRuleIndex === -1) return [...correctedArray, pageNumber];

        if (brokenRuleIndex === 0) return [pageNumber, ...correctedArray];

        const beforeBrokenRule = correctedArray.slice(0, brokenRuleIndex);
        const afterBrokenRule = correctedArray.slice(brokenRuleIndex, i);

        return [...beforeBrokenRule, pageNumber, ...afterBrokenRule];
      }, []);

      const middleIndex = Math.floor(corrected.length / 2);

      return acc + +corrected[middleIndex];
    }

    return acc;
  }, 0);

  console.log(correctUpdatesValue);
});
