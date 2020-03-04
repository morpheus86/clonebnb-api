"strict mode";

const getDatesInBetween = (start, end) => {
  let dates = [];
  while (start < end) {
    dates = [...dates, new Date(start)];
    start.setDate(start.getDate() + 1);
  }
  dates = [...dates, end];
  return dates;
};

//Checks if 2 dates ranges overlap;

module.exports = {
  getDatesInBetween
};
