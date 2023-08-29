import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import moment from "moment/moment";
import { AntDesign } from "@expo/vector-icons";

import useStyle from "@/src/zustand/useStyle";
import db from "@/src/db/daysTable";

export default function CustomCalendar({ value, onChange }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useStyle((state) => state.style);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [firstDay, setFirstDay] = useState(0);
  const [month, setMonth] = useState(0);
  const [differences, setDifferences] = useState({});

  useEffect(() => {
    setDaysInMonth(moment(value, "YYYY/MM/DD").daysInMonth());
    setFirstDay(moment(value, "YYYY/MM/DD").startOf("month").day());
    setSelectedDate(value);
    setMonth(moment(value, "YYYY/MM/DD").month());
  }, []);

  useEffect(() => {
    setDaysInMonth(moment(selectedDate, "YYYY/MM/DD").daysInMonth());
    setFirstDay(moment(selectedDate, "YYYY/MM/DD").startOf("month").day());
    setMonth(moment(selectedDate, "YYYY/MM/DD").month());
  }, [selectedDate]);

  useEffect(() => {
    db.getMonthDifference(selectedDate).then((data) => {
      let diff = {};
      data.forEach((day) => {
        diff[day.date] = day.difference;
      });
      setDifferences(diff);
    });
  }, [month, modalVisible]);

  const color = (day) => {
    const date = moment(selectedDate, "YYYY/MM/DD").date(day);
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
      setSelectedDate(moment(selectedDate, "YYYY/MM/DD").date(day));
      onChange(
        moment(selectedDate, "YYYY/MM/DD").date(day).format("YYYY/MM/DD")
      );
    }
  };

  const handleMonthChange = (addFlag) => {
    setSelectedDate(
      addFlag
        ? moment(selectedDate, "YYYY/MM/DD").add(1, "month")
        : moment(selectedDate, "YYYY/MM/DD").subtract(1, "month")
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.button, styles.row]}
      >
        <Text style={styles.datePreview}>
          {moment(selectedDate, "YYYY/MM/DD").format("dddd, MMMM Do YYYY")}
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
                  style={[styles.buttonPrimary, { padding: 10 }]}
                  onPress={() => handleMonthChange(false)}
                >
                  <AntDesign name="left" size={18} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>
                  {moment(selectedDate, "YYYY/MM/DD").format("MMMM YYYY")}
                </Text>
                <TouchableOpacity
                  style={[styles.buttonPrimary, { padding: 10 }]}
                  onPress={() => handleMonthChange(true)}
                >
                  <AntDesign name="right" size={18} color="white" />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (dayName) => (
                    <Text
                      key={dayName}
                      style={[
                        styles.sideLabel,
                        { flex: 1, textAlign: "center" },
                      ]}
                    >
                      {dayName}
                    </Text>
                  )
                )}
              </View>
              {generateCalendar().map((week, weekIndex) => (
                <View key={weekIndex} style={{ flexDirection: "row" }}>
                  {week.map((day, dayIndex) => {
                    if (day) {
                      return (
                        <TouchableOpacity
                          key={dayIndex}
                          style={[
                            styles.dayCircle,
                            day === moment(selectedDate, "YYYY/MM/DD").date()
                              ? styles.daySelected
                              : color(day),
                          ]}
                          onPress={() => handleDateSelect(day)}
                        >
                          {day !== null && (
                            <Text style={styles.dayText}>{day}</Text>
                          )}
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          key={dayIndex}
                          style={[styles.dayCircle]}
                          onPress={() => handleDateSelect(day)}
                        ></TouchableOpacity>
                      );
                    }
                  })}
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
