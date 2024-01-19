import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import moment from "moment/moment";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import months from "@/constants/Months";

import useStyle from "@/src/zustand/useStyle";
import { monthAndYear, completeDate } from "../../helpers/dates";

export default function CustomCalendar({ value, onChange, color }) {
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useStyle((state) => state.style);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [firstDay, setFirstDay] = useState(0);
  const [seeMonths, setSeeMonths] = useState(false);
  const [year, setYear] = useState(moment(value, "YYYY/MM/DD").year().toString());
  const { t } = useTranslation();

  useEffect(() => {
    const d = moment(value, "YYYY/MM/DD");
    setDaysInMonth(d.daysInMonth());
    setFirstDay(d.startOf("month").day());
    setYear(d.year().toString());
  }, [value]);

  const days = [
    t("days-short.Sunday"),
    t("days-short.Monday"),
    t("days-short.Tuesday"),
    t("days-short.Wednesday"),
    t("days-short.Thursday"),
    t("days-short.Friday"),
    t("days-short.Saturday"),
  ];

  const translatedMonths = months.map((month) => ({
    ...month,
    name: t("months." + month.label),
  }));


  const generateCalendar = () => {
    const calendar = [];
    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];

      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDay) || dayCounter > daysInMonth) {
          if (i > 4) break;
          week.push(null);
        } else {
          week.push(dayCounter++);
        }
      }

      calendar.push(week);
    }

    return calendar;
  };

  const handleDateSelect = (day) => {
    if (day !== null) {
      onChange(moment(value, "YYYY/MM/DD").date(day).format("YYYY/MM/DD"));
    }
  };

  const handleMonthChange = (addFlag) => {
    onChange(
      addFlag
        ? moment(value, "YYYY/MM/DD").add(1, "month")
        : moment(value, "YYYY/MM/DD").subtract(1, "month")
    );
  };

  const handleMonth = (month) => {
    setSeeMonths(false);
    onChange(
      moment(value, "YYYY/MM/DD")
        .month(month - 1)
        .format("YYYY/MM/DD")
    );
  }

  const handleYear = (year) => {
    setYear(year);
    if (year.length != 4) return;
    setSeeMonths(true);
    onChange(
      moment(value, "YYYY/MM/DD")
        .year(year)
        .format("YYYY/MM/DD")
    );
  }

  const renderMonths = () => {
  const actualMonth = moment(value, "YYYY/MM/DD").month() + 1;

  return (
    <>
      <View style={[styles.row, { flexWrap: "wrap", gap: 5 }]}>
        <TextInput
          style={[styles.input, { minWidth: 100, textAlign: "center" }]}
          value={year}
          onChangeText={handleYear}
          keyboardType="numeric"
        />
      </View>
      <View style={[styles.row, { flexWrap: "wrap", gap: 5 }]}>
        {
          translatedMonths.map((month, index) => (
            <TouchableOpacity
              style={[styles.button, { minWidth: 100 }, actualMonth == month.value ? { backgroundColor: "#78787878" } : {}]}
              onPress={() => handleMonth(month.value)}
              key={index}
            >
              <Text style={styles.sideLabel}>
                {month.name}
              </Text>
            </TouchableOpacity>
          ))
        }
      </View>
    </>
  );
};



  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.button, styles.row]}
      >
        <Text style={styles.datePreview}>
          {completeDate(moment(value, "YYYY/MM/DD"), t)}
        </Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent]}>
            <View style={{ padding: 10 }}>
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleMonthChange(false)}
                >
                  <AntDesign name="arrowleft" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setSeeMonths(!seeMonths)}
                >
                  <Text style={styles.title}>
                    {monthAndYear(moment(value, "YYYY/MM/DD"), t)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleMonthChange(true)}
                >
                  <AntDesign name="arrowright" size={22} color="black" />
                </TouchableOpacity>
              </View>
              {
                seeMonths ?
                  renderMonths()
                  :
                  <>
                    <View style={{ flexDirection: "row", marginBottom: 10 }}>
                      {days.map((dayName) => (
                        <Text
                          key={dayName}
                          style={[
                            styles.sideLabel,
                            { flex: 1, textAlign: "center" },
                          ]}
                        >
                          {dayName}
                        </Text>
                      ))}
                    </View>
                    {generateCalendar().map((week, weekIndex) => (
                      <View key={weekIndex} style={{ flexDirection: "row" }}>
                        {week.map((day, dayIndex) => (
                          <TouchableOpacity
                            key={dayIndex}
                            style={[
                              styles.dayCircle,
                              day === moment(value, "YYYY/MM/DD").date()
                                ? styles.daySelected
                                : color ? color(day) : { backgroundColor: "#78787878" },
                            ]}
                            onPress={() => handleDateSelect(day)}
                          >
                            {day !== null && (
                              <Text style={styles.dayText}>{day}</Text>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    ))}
                  </>}
            </View>

          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
