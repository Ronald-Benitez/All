import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import moment from "moment";

import db from "@/src/db/daysTable";
import useStyle from "@/src/zustand/useStyle";

const differenceOptions = ["Unasigned", "Equal", "Better", "Worse"];

const WeeklyReview = ({ date, reload }) => {
  const styles = useStyle((state) => state.style);
  const [data, setData] = useState([]);

  const getColor = (difference) => {
    switch (difference) {
      case "0":
        return styles.unasigned;
      case "1":
        return styles.equal;
      case "2":
        return styles.better;
      case "3":
        return styles.worse;
      default:
        return styles.unasigned;
    }
  };

  useEffect(() => {
    const startDate = moment(date, "YYYY/MM/DD")
      .startOf("week")
      .format("YYYY/MM/DD");
    const endDate = moment(date, "YYYY/MM/DD")
      .endOf("week")
      .format("YYYY/MM/DD");

    db.getByDateRange(startDate, endDate).then((data) => {
      setData(data);
    });
  }, [date, reload]);

  return (
    <View style={styles.container}>
      {data.map((day, index) => {
        const color = getColor(day.difference);
        return (
          <View key={index} style={[styles.block]}>
            <Text style={[styles.subtitle, color]}>
              {moment(day.date, "YYYY/MM/DD").format("dddd DD MMMM YYYY")}
            </Text>
            <Text style={[styles.sideLabel, color]}>
              {differenceOptions[day.difference]}
            </Text>

            <Text style={[styles.sideLabel, styles.borderedBlock_, color]}>
              {day.expected}
            </Text>
            <Text style={[styles.sideLabel, styles.borderedBlock_, color]}>
              {day.real}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default WeeklyReview;
