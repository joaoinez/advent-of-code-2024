import reports from "./input.js";

const safe = reports.reduce((acc, record) => {
  const { verdict } = record.reduce(
    ({ isAsc, verdict }, value, i) => {
      if (!verdict) return { isAsc, verdict };
      if (i === 0) return { isAsc, verdict };

      const diff = value - record[i - 1];

      if (i === 1) {
        if (diff === 0 || Math.abs(diff) > 3) return { isAsc, verdict: false };

        return { isAsc: diff > 0, verdict };
      }

      if (diff === 0) return { isAsc, verdict: false };

      if (diff < 0 && isAsc) return { isAsc, verdict: false };

      if (diff > 0 && !isAsc) return { isAsc, verdict: false };

      if (Math.abs(diff) > 3) return { isAsc, verdict: false };

      return { isAsc, verdict: true };
    },
    {
      isAsc: "unknown",
      verdict: "unknown",
    },
  );

  return verdict === true ? acc + 1 : acc;
}, 0);

console.log(safe);
