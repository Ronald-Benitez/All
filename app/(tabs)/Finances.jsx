import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Modal, Text, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";

import AddRegister from "@/src/components/finances/AddRegister";
import AddRegisterList from "@/src/components/finances/AddRegisterList";
import OptionPicker from "@/src/components/configs/OptionPicker";
import RegisterCard from "@/src/components/finances/RegisterCard";
import RegistersList from "@/src/components/finances/RegistersList";
import groupsHandler from "../../src/db/groupTables";
import Filter from "@/src/components/ui/Filter";
import useStyle from "@/src/zustand/useStyle";


export default function Finances({ savingsFlag = false }) {
  const db = new groupsHandler(
    savingsFlag ? "savingsGroup" : "registerGroup"
  );
  const [actualRegister, setActualRegister] = useState("");
  const [registers, setRegisters] = useState([]);
  const [register, setRegister] = useState(null);
  const [reload, setReload] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [isCard, setIsCard] = useState(true);
  const [isList, setIsList] = useState(true);
  const [seeFilter, setSeeFilter] = useState(false);
  const [filter, setFilter] = useState([]);
  const styles = useStyle((state) => state.style);

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
          <TextInput
            style={[styles.input, { minWidth: 100, textAlign: "center" }]}
            value={year}
            onChangeText={setYear}
            placeholder="Year"
            keyboardType="numeric" />

          <AddRegister
            reload={() => setReload(!reload)}
            savingsFlag={savingsFlag}
          >
            <AntDesign name="addfolder" size={20} color="black" />
          </AddRegister>
          {register && (
            <AddRegisterList
              group={register}
              setRegister={setRegister}
              style={styles.button}
              savingsFlag={savingsFlag}
            >
              <AntDesign name="addfile" size={20} color="black" />
            </AddRegisterList>
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
          <Filter setFilters={setFilter} />
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
            reload={() => setReload(!reload)}
            register={register}
            handleReload={handleReloadActual}
            isDown={isCard}
            setIsDown={setIsCard}
            setRegister={setRegister}
            savingsFlag={savingsFlag}
          />
        </View>

        <View style={isCard ? { maxHeight: "37%" } : { maxHeight: "65%" }}>
          <RegistersList
            reload={reload}
            setReload={setReload}
            group={register}
            setGroup={setRegister}
            handleReload={handleReloadActual}
            isDown={isList}
            setIsDown={setIsList}
            filter={filter}
            savingsFlag={savingsFlag}
          />
        </View>
      </View>
    </>
  );
}
