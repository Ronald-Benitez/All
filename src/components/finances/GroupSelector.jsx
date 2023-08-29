import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import moment from "moment/moment";
import { AntDesign } from "@expo/vector-icons";

import useStyle from "@/src/zustand/useStyle";
import OptionPicker from "@/src/components/configs/OptionPicker";
import TableHandler from "../../db/groupTables";

export default function GroupSelector({ setGroup, savingsFlag }) {
  const styles = useStyle((state) => state.style);
  const [actualRegister, setActualRegister] = useState("");
  const [registers, setRegisters] = useState([]);
  const [year, setYear] = useState(moment().format("YYYY"));
  const db = new TableHandler(savingsFlag ? "savingsGroup" : "registerGroup");

  useEffect(() => {
    db.getByYear(year).then((data) => {
      setRegisters(data);
      const last = data[data.length - 1];
      if (last) {
        setActualRegister(last.id);
        setGroup(last);
      } else {
        setActualRegister("");
        setGroup("");
      }
    });
  }, [year]);

  useEffect(() => {
    if (!actualRegister || actualRegister == "");
    setGroup(registers.find((item) => item.id === actualRegister));
  }, [actualRegister]);

  const registersList = () => {
    if (registers.length === 0) return [{ label: "No registers", value: "0" }];
    return registers.map((item) => {
      return {
        label:
          item.name +
          moment(item.month, "MM").format(" (MMMM") +
          " " +
          item.year +
          ")",
        value: item.id,
      };
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            setYear(moment(year).subtract(1, "years").format("YYYY"))
          }
        >
          <AntDesign name="left" size={20} color="black" />
        </TouchableOpacity>

        <Text style={styles.text}>{year}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setYear(moment(year).add(1, "years").format("YYYY"))}
        >
          <AntDesign name="right" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <OptionPicker
        options={registersList()}
        value={registersList().findIndex(
          (item) => item.value === actualRegister
        )}
        onChange={setActualRegister}
      />
    </View>
  );
}
