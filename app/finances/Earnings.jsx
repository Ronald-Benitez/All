import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Modal, Text, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";

import OptionPicker from "@/src/components/configs/OptionPicker";
import GroupsHandler from "@/src/db/groupTables";
import EarningsList from "@/src/components/finances/EarningsList";
import AddEarning from "@/src/components/finances/AddEarning";
import useStyle from "@/src/zustand/useStyle";
import monthOptions from "@/constants/Months.json"

const db = new GroupsHandler("registerGroup");

const Earnings = () => {
  const styles = useStyle((state) => state.style);
  const [actualRegister, setActualRegister] = useState("");
  const [seeAdd, setSeeAdd] = useState(false);
  const [registers, setRegisters] = useState([]);
  const [register, setRegister] = useState(null);
  const [reload, setReload] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [month, setMonth] = useState(moment().format("MM"));
  const [totalEarn, setTotalEarn] = useState(0);
  const [seeFilter, setSeeFilter] = useState(false);
  const [filter, setFilter] = useState("");

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

  const registersList = () => {
    if (registers.length === 0) {
      return [{ label: "No registers", value: "0" }];
    }
    return registers.map((item) => ({
      label: `${item.name} (${moment(item.month, "MM").format("MMMM")} ${item.year
        })`,
      value: item.id,
    }));
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <OptionPicker
            options={monthOptions}
            value={monthOptions.findIndex((item) => item.value === month)}
            onChange={setMonth}
          />
          <TextInput
            style={[styles.input, { minWidth: 100, textAlign: "center" }]}
            value={year}
            onChangeText={setYear}
            placeholder="Year"
            keyboardType="numeric" />
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
              setSeeFilter(!seeFilter);
            }}
          >
            <AntDesign name="filter" size={18} color="black" />
          </TouchableOpacity>
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
            filter={filter}
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
      <Modal visible={seeFilter} transparent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSeeFilter(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.block}>
              <Text style={styles.sideLabel}>Filters </Text>
              <TextInput
                style={styles.input}
                value={filter}
                onChangeText={setFilter}
                placeholder="You can add several"
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default Earnings;
