export const getMonthLength = (currentYear, currentMonth) => {
  const lastMonthDay = new Date(currentYear, currentMonth + 1, -1).getDate();
  return lastMonthDay + 1;
}
export const getEmptyCellsLength = (currentYear, currentMonth) => {
  let currentDate = new Date(currentYear, currentMonth);
  currentDate.setDate(1);
  const start = currentDate.getDay();
  currentDate.setMonth(currentDate.getMonth() + 1);
  currentDate.setDate(0);
  const finish = currentDate.getDay();
  let result = {start: [], finish: []};
  for (let i = 0; i < start; i ++) {
    result.start.push(i);
  }
  for (let i = finish; i < 7 - 1; i++) {
    result.finish.push(i);
  }
  return result;
}