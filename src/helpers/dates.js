import moment from "moment";

export const month = (date, t) => {
  return t(`months.${moment(date).format("MMMM")}`);
};

export const monthAndYear = (date, t) => {
  return month(date, t) + " " + moment(date).format("YYYY");
};

export const day = (date, t) => {
  return t(`days.${moment(date).format("dddd")}`);
};

export const dayAndMonth = (date, t) => {
  return moment(date).format("DD") + " " + month(date, t);
};

export const dayStringAndNumber = (date, t) => {
  return day(date, t) + " " + moment(date).format("DD");
};

export const completeDate = (date, t) => {
  const d = moment(date, "YYYY/MM/DD");
  const day = t(`days.${d.format("dddd")}`);
  const dayNumber = d.format("DD");
  const month = t(`months.${d.format("MMMM")}`);
  const year = d.format("YYYY");
  return `${day} ${dayNumber}, ${month} ${year}`;
};
