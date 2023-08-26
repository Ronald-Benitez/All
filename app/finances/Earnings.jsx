import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Modal, Text } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";

import getStyles from "@/src/styles/styles";
import AddRegister from "@/src/components/finances/AddRegister";
import AddRegisterList from "@/src/components/finances/AddRegisterList";
import OptionPicker from "@/src/components/configs/OptionPicker";
import RegisterCard from "@/src/components/finances/RegisterCard";
import RegistersListCard from "@/src/components/finances/RegistersList";
import GroupsHandler from "@/src/db/groupTables";
import EarningsList from "@/src/components/finances/EarningsList";
import AddEarning from "@/src/components/finances/AddEarning";

const db = new GroupsHandler("registerGroup");

const Earnings = () => {
  const [styles, setStyles] = useState({});
  const [actualRegister, setActualRegister] = useState("");
  const [seeAdd, setSeeAdd] = useState(false);
  const [registers, setRegisters] = useState([]);
  const [register, setRegister] = useState(null);
  const [reload, setReload] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [month, setMonth] = useState(moment().format("MM"));
  const [isCard, setIsCard] = useState(true);
  const [isList, setIsList] = useState(true);
  const [totalEarn, setTotalEarn] = useState(0);

  useEffect(() => {
    getStyles().then(setStyles);
  }, []);

  useEffect(() => {
    fetchRegisters();
  }, [year, reload]);

  useEffect(() => {
    if (actualRegister && actualRegister !== "") {
      setRegister(registers.find((item) => item.id === actualRegister));
    }
  }, [actualRegister, registers]);

  const fetchRegisters = () => {
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
  };

  const years = () => {
    const years = [];
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
    if (registers.length === 0) {
      return [{ label: "No registers", value: "0" }];
    }
    return registers.map((item) => ({
      label: `${item.name} (${moment(item.month, "MM").format("MMMM")} ${
        item.year
      })`,
      value: item.id,
    }));
  };

  const months = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().subtract(i, "months").format("MM");
      months.push({
        label: moment(month, "MM").format("MMMM"),
        value: month,
      });
    }
    return months;
  };

  const monthOptions = months();
  const yearOptions = years();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <OptionPicker
            options={monthOptions}
            value={monthOptions.findIndex((item) => item.value === month)}
            onChange={setMonth}
          />

          <OptionPicker
            options={yearOptions}
            value={yearOptions.findIndex((item) => item.value === year)}
            onChange={setYear}
          />
          {register && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSeeAdd(true)}
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setReload(!reload);
            }}
          >
            <MaterialIcons name="loop" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.block}>
          <View style={styles.row}>
            <Text style={styles.sideLabel}>Total: </Text>
            <Text style={styles.sideLabel}>$ {totalEarn.toFixed(2)}</Text>
          </View>
        </View>
        <View
          style={{
            maxHeight: "70%",
          }}
        >
          <EarningsList
            groupId={actualRegister}
            setTotal={setTotalEarn}
            setReload={setReload}
            reload={reload}
          />
        </View>
      </View>
      <Modal visible={seeAdd} transparent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSeeAdd(false)}
        >
          <View style={styles.modalContent}>
            <AddEarning
              groupId={actualRegister}
              setReload={setReload}
              reload={reload}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default Earnings;
