import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";
import { useSelector } from "react-redux";

import ProfitsList from "@/src/components/finances/ProfitsList";
import AddProfit from "@/src/components/finances/AddProfit";
import Filter from "@/src/components/ui/Filter";
import ProfitsCard from "@/src/components/finances/ProfitsCard";
import GroupSelector from "@/src/components/finances/GroupSelector";

const Profits = () => {
  const styles = useSelector((state) => state.styles.styles);
  const [reload, setReload] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [totalEarn, setTotalEarn] = useState(0);
  const [filter, setFilter] = useState([]);
  const register = useSelector((state) => state.group.group);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.row}>
          <GroupSelector
            savingsFlag={false}
            year={year}
            setYear={setYear}
            reload={reload}
          />
        </View>
        <View style={styles.row}>
          {register && (
            <AddProfit
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
