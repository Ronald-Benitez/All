import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import useStyle from "@/src/zustand/useStyle";
import db from "@/src/db/daysTable";
import DatePicker from "@/src/components/configs/DatePicker.jsx";

export default function CustomCalendar({ value, onChange }) {
  const styles = useStyle((state) => state.style);
  const [differences, setDifferences] = useState({});

  useEffect(() => {
    console.log("value", value);
    db.getMonthDifference(value).then((data) => {
      if (!data) {
        setDifferences({});
        return;
      }
      let diff = {};
      data.forEach((day) => {
        diff[day.date] = day.difference;
      });
      setDifferences(diff);
    });
  }, [value]);

  const color = (day) => {
    const date = moment(value, "YYYY/MM/DD").date(day);
    const formatedDate = moment(date).format("YYYY/MM/DD");
    const difference = differences[formatedDate];
    const colors = {
      0: styles.unasignedBg,
      1: styles.equalBg,
      2: styles.betterBg,
      3: styles.worseBg,
    };
    return colors[difference] || styles.unasignedBg;
  };

  return (
    <DatePicker value={value} onChange={onChange} color={color} />
  );
}
