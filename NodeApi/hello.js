function getNextMonthDates() {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const fifteenthDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 16);
  const thirtiethDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 31);

  return {
    fifteenth: fifteenthDate.toISOString().slice(0, 10),
    thirtieth: thirtiethDate.toISOString().slice(0, 10),
  };
}

const result = getNextMonthDates();

console.log('15th of the next month:', result.fifteenth);
console.log('30th of the next month:', result.thirtieth);
