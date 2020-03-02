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
const checkIfBooked = async (id, start, end) => {
  const res = await Booking.findAll({
    where: {
      startDate: {
        [Op.lte]: new Date(end)
      },
      endDate: {
        [Op.gte]: new Date(star)
      }
    }
  });
  return !(results.length > 0);
};

module.exports = {
  getDatesInBetween,
  checkIfBooked
};
