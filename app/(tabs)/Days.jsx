import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import moment from "moment/moment";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import OptionPicker from "@/src/components/configs/OptionPicker";
import CustomCalendar from "@/src/components/configs/CustomCalendar";
import db from "@/src/db/daysTable";
import DataContainer from "@/src/components/Days/DataContainer";
import StadisticsContainer from "@/src/components/Days/StadisticsContainer";
import WeeklyReview from "@/src/components/Days/WeeklyReview";
import useStyle from "@/src/zustand/useStyle";
import { useTranslation } from "react-i18next";


export default function Days() {
  const styles = useStyle((state) => state.style);
  const [date, setDate] = useState(moment().format("YYYY/MM/DD"));
  const [edit, setEdit] = useState(false);
  const [difference, setDifference] = useState("0");
  const [seeStadistics, setSeeStadistics] = useState(false);
  const [seeWeek, setSeeWeek] = useState(false);
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const { t } = useTranslation();


  const differenceOptions = [
    { label: t("days-feature.Unasigned"), value: "0" },
    { label: t("days-feature.Equal"), value: "1" },
    { label: t("days-feature.Better"), value: "2" },
    { label: t("days-feature.Worse"), value: "3" },
  ];

  useEffect(() => {
    db.getItem(date).then((data) => {
      if (data) {
        setDifference(data.difference);
        setData(data);
      } else {
        db.insertItem(date, "", "", "0");
        setData({ date, expected: "", real: "", difference });
        setDifference(0);
      }
    });
  }, [date]);

  const handleDifferenceChange = (value) => {
    setDifference(value);
    db.updateDifference(date, value);
    setReload(!reload);
  };

  const getColor = () => {
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

  const editButton = () => {
    if (!seeStadistics && !seeWeek) {
      return (
        <TouchableOpacity
          onPress={() => {
            setEdit(!edit);
            setSeeStadistics(false);
            setSeeWeek(false);
          }}
          style={[
            styles.button,
            {
              margin: 5,
            },
          ]}
        >
          {edit ? (
            <AntDesign name="checkcircleo" size={15} color="black" />
          ) : (
            <Feather name="edit" size={15} color="black" />
          )}
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={{}}>
      <View style={[styles.row]}>
        <TouchableOpacity
          onPress={() => {
            setDate(moment().format("YYYY/MM/DD"));
          }}
        >
          <Text
            style={[
              styles.day,
              getColor(),
              {
                margin: 5,
              },
            ]}
          >
            {t(`days.${moment(date, "YYYY/MM/DD").format("dddd")}`)}
          </Text>
        </TouchableOpacity>

        <OptionPicker
          options={differenceOptions}
          value={difference}
          onChange={handleDifferenceChange}
          color={{ ...getColor(), borderWidth: 1 }}
        />
        <TouchableOpacity
          onPress={() => {
            setSeeStadistics(!seeStadistics);
            setSeeWeek(false);
            setEdit(false);
          }}
          style={[
            styles.button,
            {
              margin: 5,
            },
          ]}
        >
          {seeStadistics ? (
            <Ionicons name="today-outline" size={15} color="black" />
          ) : (
            <Feather name="pie-chart" size={15} color="black" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSeeWeek(!seeWeek);
            setSeeStadistics(false);
            setEdit(false);
          }}
          style={[
            styles.button,
            {
              margin: 5,
            },
          ]}
        >
          {seeWeek ? (
            <Ionicons name="today-outline" size={15} color="black" />
          ) : (
            <MaterialCommunityIcons
              name="calendar-weekend-outline"
              size={15}
              color="black"
            />
          )}
        </TouchableOpacity>
        {editButton()}
      </View>
      <ScrollView
        style={{
          height: "80%",
          width: "100%",
        }}
      >
        {seeStadistics && <StadisticsContainer day={date} reload={reload} />}
        {!seeStadistics && !seeWeek && (
          <DataContainer
            day={date}
            color={getColor()}
            edit={edit}
            data={data}
            reload={reload}
            setReload={setReload}
          />
        )}

        {seeWeek && <WeeklyReview date={date} reload={reload} />}
      </ScrollView>
      <View style={[styles.row]}>
        <TouchableOpacity
          onPress={() => {
            setDate(
              moment(date, "YYYY/MM/DD")
                .subtract(1, "days")
                .format("YYYY/MM/DD")
            );
          }}
          style={[styles.button]}
        >
          <AntDesign name="left" size={18} color="black" />
        </TouchableOpacity>
        <CustomCalendar value={date} onChange={setDate} />
        <TouchableOpacity
          onPress={() => {
            setDate(
              moment(date, "YYYY/MM/DD").add(1, "days").format("YYYY/MM/DD")
            );
          }}
          style={[styles.button]}
        >
          <AntDesign name="right" size={18} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
