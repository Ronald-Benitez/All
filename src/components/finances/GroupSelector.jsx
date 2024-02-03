import React, { useState, useEffect, useCallback } from "react";
import { View, TextInput } from "react-native";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "expo-router";

import OptionPicker from "@/src/components/configs/OptionPicker";
import TableHandler from "../../db/groupTables";
import { setType, setGroup } from "@/app/slices/groupSlice";

export default function GroupSelector({ setYear, year, reload, savingsFlag }) {
  const styles = useSelector((state) => state.styles.styles);
  const [actualRegister, setActualRegister] = useState("");
  const [registers, setRegisters] = useState([]);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const db = new TableHandler(savingsFlag ? "savingsGroup" : "registerGroup");

  useFocusEffect(
    useCallback(() => {
      const type = savingsFlag ? {
        group: "savingsGroup",
        list: "savingsList"
      } : {
        group: "registerGroup",
        list: "registerList"
      }

      dispatch(setType(type));
    }, [])
  );

  useEffect(() => {
    db.getByYear(year).then((data) => {
      setRegisters(data);
      if (actualRegister) {
        const selectedGroup = data.find((item) => item.id === actualRegister);
        setGroupAndDispatch(selectedGroup);
      } else {
        handleSetLast(data);
      }
    })

  }, [reload, actualRegister, year]);

  const handleSetLast = (data) => {
    const last = data[data.length - 1];
    if (last) {
      setActualRegister(last.id);
      setGroupAndDispatch(last);
    } else {
      setActualRegister("");
      setGroupAndDispatch("");
    }
  };

  const setGroupAndDispatch = (group) => {
    setGroup(group);
    dispatch(setGroup(group));
  };

  useEffect(() => {
    if (actualRegister && actualRegister !== "") {
      const selectedGroup = registers.find((item) => item.id === actualRegister);
      setGroupAndDispatch(selectedGroup);
    }
  }, [actualRegister, registers]);

  const registersList = () => {
    if (registers.length === 0) {
      return [{ label: t("finances-feature.no-registers"), value: "0" }];
    }

    return registers.map((item) => ({
      label: `${item.name} (${t(`months.${moment(item.month, "MM").format("MMMM")}`)} ${item.year})`,
      value: item.id,
    }));
  };

  return (
    <View style={[styles.container, { width: "100%" }]}>
      <View style={[styles.row, { justifyContent: "space-between", width: "90%", padding: 0, margin: 0 }]}>
        <TextInput
          style={[styles.input, { minWidth: 60, maxWidth: 60, textAlign: "center", margin: 0, padding: 0 }]}
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
        <OptionPicker
          options={registersList()}
          value={registersList().findIndex((item) => item.value === actualRegister)}
          onChange={setActualRegister}
        />
      </View>
    </View>
  );
}
