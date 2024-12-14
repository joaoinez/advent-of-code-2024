import reports from "./input.js";

const isReportSafe = (report) => {
  const { verdict } = report.reduce(
    ({ verdict, isAsc }, value, i) => {
      if (verdict === false || i === report.length - 1)
        return { verdict, isAsc };

      const diff = report[i + 1] - value;

      if (diff === 0) return { verdict: false, isAsc };

      if (isAsc === null)
        return {
          verdict: Math.abs(diff) > 3 ? false : true,
          isAsc: diff > 0,
        };

      return {
        verdict:
          (diff > 0 && isAsc === false) ||
          (diff < 0 && isAsc === true) ||
          Math.abs(diff) > 3
            ? false
            : true,
        isAsc: diff > 0,
      };
    },
    { verdict: null, isAsc: null },
  );

  return verdict;
};

const safeReports = reports.reduce((count, report) => {
  const isSafe = isReportSafe(report);

  if (!isSafe) {
    const isTolerable = report.reduce((verdict, _, i) => {
      if (verdict) return verdict;

      const trimmedReport = report.reduce(
        (acc, val, ti) => (ti === i ? acc : acc.concat(val)),
        [],
      );

      return isReportSafe(trimmedReport);
    }, false);

    return isTolerable ? count + 1 : count;
  }

  return isSafe ? count + 1 : count;
}, 0);

console.log(safeReports);
