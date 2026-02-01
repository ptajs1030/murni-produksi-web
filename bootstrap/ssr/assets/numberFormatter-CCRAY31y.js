const formatNumberWithCommas = (value, decimalPlaces = 0) => {
  if (!value && value !== 0) return "0";
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "0";
  return number.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  });
};
export {
  formatNumberWithCommas as f
};
