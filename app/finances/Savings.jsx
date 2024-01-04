import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Modal, Text, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";

import useStyle from "@/src/zustand/useStyle";
import AddRegister from "@/src/components/finances/AddRegister";
import AddRegisterList from "@/src/components/finances/AddRegisterList";
import OptionPicker from "@/src/components/configs/OptionPicker";
import RegisterCard from "@/src/components/finances/RegisterCard";
import RegistersListCard from "@/src/components/finances/RegistersList";
import GroupsHandler from "@/src/db/groupTables";
import monthOptions from "@/constants/Months.json"

const db = new GroupsHandler("savingsGroup");

const Savings = () => {
  const styles = useStyle((state) => state.style);
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

          <TouchableOpacity
            style={styles.button}
            onPress={() => setSeeAdd(true)}
          >
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

        <View style={styles.row}>
          <RegisterCard
            reload={reload}
            setReload={setReload}
            register={register}
            handleReload={handleReloadActual}
            isDown={isCard}
            setIsDown={setIsCard}
            setRegister={setRegister}
            savingsFlag={true}
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
            savingsFlag={true}
            filter={filter}
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
                savingsFlag={true}
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
              <AddRegisterList
                group={register}
                setRegister={setRegister}
                savingsFlag={true}
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
      </View>
    </>
  );
};

export default Savings;
