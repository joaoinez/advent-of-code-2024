import input from "./input.js";

const matched = input.match(/(do\(\))|(don't\(\))|(mul\(\d{1,3},\d{1,3}\))/g);

const stripMul = (x) => x.replace("mul(", "").replace(")", "");

const getMulValue = (x) => x.split(",")[0] * x.split(",")[1];

const { value } = matched.reduce(
  ({ value, active }, val) => {
    const type = val === "do()" ? "do" : val === "don't()" ? "donot" : "mul";

    if (type === "mul")
      return {
        value: active ? value + getMulValue(stripMul(val)) : value,
        active,
      };

    if (type === "do" && !active) return { value, active: true };

    if (type === "donot" && active) return { value, active: false };

    return { value, active };
  },
  { value: 0, active: true },
);

console.log(value);
