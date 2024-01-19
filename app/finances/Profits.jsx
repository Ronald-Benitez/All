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
import ProfitsCard from "@/src/components/finances/ProfitsCard";
import GroupSelector from "@/src/components/finances/GroupSelector";

const Profits = () => {
  const styles = useStyle((state) => state.style);
  const [register, setRegister] = useState(null);
  const [reload, setReload] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [totalEarn, setTotalEarn] = useState(0);
  const [filter, setFilter] = useState([]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <GroupSelector
            setGroup={setRegister}
            savingsFlag={false}
            year={year}
            setYear={setYear}
            reload={reload}
          />
        </View>
        <View style={styles.row}>
          {register && (
            <AddProfit
              groupId={register?.id}
              reload={() => setReload(!reload)}
              style={styles.button}
            >
              <AntDesign name="addfile" size={20} color="black" />
            </AddProfit>
          )}
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
          reload={() => setReload(!reload)}
          year={year}
        />
        <View
          style={{
            maxHeight: "66%",
          }}
        >
          <ProfitsList
            groupId={register?.id}
            setTotal={setTotalEarn}
            reload={reload}
            setReload={() => setReload(!reload)}
            filter={filter}
          />
        </View>
      </View>
    </>
  );
};

export default Profits;
