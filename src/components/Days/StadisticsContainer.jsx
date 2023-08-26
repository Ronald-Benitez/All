import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { VictoryChart, VictoryBar } from "victory-native";
import moment from "moment";

import db from "@/src/db/daysTable";
import getStyles from "@/src/styles/styles";
import { getDaysColors } from "@/src/helpers/files";

export default function StadisticsContainer({ day, reload }) {
  const [styles, setStyles] = useState({});
  const labels = ["Unasigned", "Equal", "Better", "Worse"];
  const [dataPie, setDataPie] = useState([]);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
    getDaysColors().then((data) => {
      setColors(data);
    });
  }, []);

  useEffect(() => {
    countDays();
  }, [day, reload]);

  const countDays = () => {
    db.getMonth(day).then((data) => {
      if (!data || data.length <= 0) return;
      let count = [0, 0, 0, 0];
      data.forEach((day) => {
        count[day.difference]++;
      });
      count[0] =
        moment(day, "YYYY/MM/DD").daysInMonth() -
        count[1] -
        count[2] -
        count[3];
      setPieData(count);
    });
  };

  const setPieData = (percents) => {
    let newData = [
      {
        x: labels[0],
        y: percents[0],
      },
      {
        x: labels[1],
        y: percents[1],
      },
      {
        x: labels[2],
        y: percents[2],
      },
      {
        x: labels[3],
        y: percents[3],
      },
    ];
    setDataPie(newData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>
          {moment(day, "YYYY/MM/DD").format("MMMM YYYY")} statistics
        </Text>
      </View>
      <View style={styles.row}>
        <VictoryChart
          domainPadding={20}
          animate={{ duration: 1000 }}
          width={350}
          height={350}
          style={{
            parent: {
              backgroundColor: "transparent",
            },
          }}
        >
          <VictoryBar
            data={dataPie}
            style={{
              data: {
                fill: ({ datum }) => {
                  return colors[datum.x]?.value;
                },
              },
            }}
          />
        </VictoryChart>
      </View>
      <View
        style={[styles.row, { justifyContent: "space-between", width: "90%" }]}
      >
        {dataPie.map((item, index) => (
          <View style={styles.column} key={index}>
            <View
              style={[
                styles.row,
                {
                  width: 25,
                  height: 25,
                  backgroundColor: colors[item.x]?.value,
                },
              ]}
            >
              <Text style={styles.sideLabel}>{item.y}</Text>
            </View>
            <Text style={styles.sideLabel}>{item.x}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
