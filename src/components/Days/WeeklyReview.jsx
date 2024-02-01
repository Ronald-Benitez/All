import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import db from "@/src/db/daysTable";
import { completeDate } from "../../helpers/dates";

const WeeklyReview = ({ date, reload }) => {
  const styles = useSelector((state) => state.styles.styles);
  const [data, setData] = useState([]);
  const { t } = useTranslation();

  const differenceOptions = {
    "0": t("days-feature.Unasigned"),
    "1": t("days-feature.Equal"),
    "2": t("days-feature.Better"),
    "3": t("days-feature.Worse")
  };

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
              {completeDate(moment(date, "YYYY/MM/DD"), t)}
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
