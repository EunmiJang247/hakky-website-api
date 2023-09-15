const newOlderDate = ({
  date, years, months, days, hours, mins,
}) => {
  const olderDate = new Date(date);
  if (years) {
    olderDate.setFullYear(date.getFullYear() + years);
  }
  if (months) {
    olderDate.setMonth(date.getMonth() + months);
  }
  if (days) {
    olderDate.setDate(date.getDate() + days);
  }
  if (hours) {
    olderDate.setHours(date.getHours() + hours);
  }
  if (mins) {
    olderDate.setMinutes(date.getMinutes() + mins);
  }

  return olderDate;
};

module.exports = { newOlderDate };
