import { useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";

import useStyle from "@/src/zustand/useStyle";
import OptionPicker from "@/src/components/configs/OptionPicker";
import TableHandler from "../../db/groupTables";

export default function GroupSelector({ setGroup, savingsFlag, setYear, year, reload }) {
  const styles = useStyle((state) => state.style);
  const [actualRegister, setActualRegister] = useState("");
  const [registers, setRegisters] = useState([]);
  const { t } = useTranslation();
  const db = new TableHandler(savingsFlag ? "savingsGroup" : "registerGroup");

  useEffect(() => {
    db.getByYear(year).then((data) => {
      setRegisters(data);
      handleSetLast(data);
    });
  }, [year]);

  useEffect(() => {
    db.getByYear(year).then((data) => {
      setRegisters(data);
      if (actualRegister) {
        setGroup(data.find((item) => item.id == actualRegister));
      } else {
        handleSetLast(data);
      }
    });
  }, [reload]);

  const handleSetLast = (data) => {
    const last = data[data.length - 1];
    if (last) {
      setActualRegister(last.id);
      setGroup(last);
    } else {
      setActualRegister("");
      setGroup("");
    }
  }

  useEffect(() => {
    if (!actualRegister || actualRegister == "");
    setGroup(registers.find((item) => item.id === actualRegister));
  }, [actualRegister]);

  const registersList = () => {
    if (registers.length === 0) return [{ label: t("finances-features.no-registers"), value: "0" }];
    return registers.map((item) => {
      return {
        label:
          item.name +
          " (" +
          t(`months.${moment(item.month, "MM").format("MMMM")}`) +
          " " +
          item.year +
          ")",
        value: item.id,
      };
    });
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
          value={registersList().findIndex(
            (item) => item.value === actualRegister
          )}
          onChange={setActualRegister}
        />
      </View>
    </View>
  );
}
