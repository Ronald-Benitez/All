import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Modal, Text, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";

import OptionPicker from "@/src/components/configs/OptionPicker";
import GroupsHandler from "@/src/db/groupTables";
import ProfitsList from "@/src/components/finances/ProfitsList";
import AddProfit from "@/src/components/finances/AddProfit";
import useStyle from "@/src/zustand/useStyle";
import Filter from "@/src/components/ui/Filter";
import ProfitsCard from "../../src/components/finances/ProfitsCard";

const db = new GroupsHandler("registerGroup");

const Profits = () => {
  const styles = useStyle((state) => state.style);
  const [actualRegister, setActualRegister] = useState("");
  const [registers, setRegisters] = useState([]);
  const [register, setRegister] = useState(null);
  const [reload, setReload] = useState(false);
  const [reloadRegister, setReloadRegister] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [totalEarn, setTotalEarn] = useState(0);
  const [filter, setFilter] = useState([]);

  useEffect(() => {
    fetchRegisters();
  }, [year, reloadRegister]);

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
          <TextInput
            style={[styles.input, { minWidth: 100, textAlign: "center" }]}
            value={year}
            onChangeText={setYear}
            placeholder="Year"
            keyboardType="numeric" />
          {register && (
            <AddProfit
              groupId={actualRegister}
              reload={() => setReload(!reload)}
              style={styles.button}
            >
              <AntDesign name="addfile" size={20} color="black" />
            </AddProfit>
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
        <ProfitsCard
          totalEarn={totalEarn}
          register={register}
          reload={() => setReloadRegister(!reloadRegister)}
        />
        <View
          style={{
            maxHeight: "66%",
          }}
        >
          <ProfitsList
            groupId={actualRegister}
            setTotal={setTotalEarn}
            reload={() => setReload(!reload)}
            filter={filter}
          />
        </View>
      </View>
    </>
  );
};

export default Profits;
