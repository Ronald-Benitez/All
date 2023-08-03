import { useState, useEffect } from "react";
import { View, TouchableOpacity, Modal, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment/moment";

import getStyles from "@/src/styles/styles";
import db from "@/src/db/registersGroupTable.js";
import AddRegister from "@/src/components/finances/AddRegister";
import AddRegisterList from "@/src/components/finances/AddRegisterList";
import OptionPicker from "@/src/components/configs/OptionPicker";
import RegisterCard from "@/src/components/finances/RegisterCard";
import RegistersListCard from "@/src/components/finances/RegistersList";

export default function Finances() {
  const [styles, setStyles] = useState({});
  const [actualRegister, setActualRegister] = useState("");
  const [seeAdd, setSeeAdd] = useState(false);
  const [registers, setRegisters] = useState([]);
  const [register, setRegister] = useState(null);
  const [reload, setReload] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [month, setMonth] = useState(moment().format("MM"));
  const [seeAddRegister, setSeeAddRegister] = useState(false);
  const [isCard, setIsCard] = useState(true);
  const [isList, setIsList] = useState(true);

  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  useEffect(() => {
    db.getByYear(year).then((data) => {
      setRegisters(data);
      const last = data[data.length - 1];
      if (last) {
        setActualRegister(last.id);
        setRegister(last);
      } else {
        setActualRegister("");
        setRegister(null);
      }
    });
  }, [year, reload]);

  useEffect(() => {
    if (!actualRegister || actualRegister == "");
    setRegister(registers.find((item) => item.id === actualRegister));
  }, [actualRegister]);

  const years = () => {
    let years = [];
    for (let i = 0; i < 10; i++) {
      const year = moment().subtract(i, "years").format("YYYY");
      years.push({
        label: year,
        value: year,
      });
    }
    return years;
  };

  const handleReloadActual = (newRegisters, actual) => {
    setRegisters(newRegisters);
    setActualRegister(actual);
    setRegister(newRegisters.find((item) => item.id === actual));
    setIsList(false);
  };

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

  const months = () => {
    let months = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().subtract(i, "months").format("MM");
      months.push({
        label: moment(month, "MM").format("MMMM"),
        value: month,
      });
    }
    return months;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <OptionPicker
          options={months()}
          value={months().findIndex((item) => item.value === month)}
          onChange={setMonth}
        />

        <OptionPicker
          options={years()}
          value={years().findIndex((item) => item.value === year)}
          onChange={setYear}
        />

        <TouchableOpacity style={styles.button} onPress={() => setSeeAdd(true)}>
          <AntDesign name="addfolder" size={20} color="black" />
        </TouchableOpacity>
        {register && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSeeAddRegister(true)}
          >
            <AntDesign name="addfile" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.row}>
        <OptionPicker
          options={registersList()}
          value={registersList().findIndex(
            (item) => item.value === actualRegister
          )}
          onChange={setActualRegister}
        />
      </View>

      <View style={styles.row}>
        <RegisterCard
          reload={reload}
          setReload={setReload}
          register={register}
          handleReload={handleReloadActual}
          isDown={isCard}
          setIsDown={setIsCard}
          setRegister={setRegister}
        />
      </View>

      <View style={isCard ? { maxHeight: "38%" } : { maxHeight: "65%" }}>
        <RegistersListCard
          reload={reload}
          setReload={setReload}
          group={register}
          setGroup={setRegister}
          handleReload={handleReloadActual}
          isDown={isList}
          setIsDown={setIsList}
        />
      </View>

      <Modal visible={seeAdd} transparent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSeeAdd(false)}
        >
          <View style={styles.modalContent}>
            <AddRegister
              reload={reload}
              setReload={setReload}
              year={year}
              month={month}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={seeAddRegister} transparent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSeeAddRegister(false)}
        >
          <View style={styles.modalContent}>
            <AddRegisterList group={register} setRegister={setRegister} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
