import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Modal, Text, TextInput } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";

import useStyle from "@/src/zustand/useStyle";
import AddBudget from "@/src/components/finances/AddBudget";
import BudgetsList from "@/src/components/finances/BudgetsList";
import Filter from "@/src/components/ui/Filter";
import BudgetsCard from "../../src/components/finances/BudgetsCard";
import GroupSelector from "@/src/components/finances/GroupSelector";

const Budgets = () => {
  const styles = useStyle((state) => state.style)
  const [register, setRegister] = useState(null);
  const [reload, setReload] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [total, setTotal] = useState(0);
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
            <AddBudget
              reload={reload}
              setReload={setReload}
              setTotal={setTotal}
              groupId={register?.id}
              style={styles.button}
            >
              <AntDesign name="addfile" size={20} color="black" />
            </AddBudget>
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
        <BudgetsCard
          totalBudget={total}
          register={register}
          reload={() => setReload(!reload)}
          year={year}
        />
        <View
          style={{
            maxHeight: "70%",
          }}
        >
          <BudgetsList
            groupId={register?.id}
            setTotal={setTotal}
            setReload={setReload}
            reload={reload}
            filter={filter}
          />
        </View>
      </View>
    </>
  );
};

export default Budgets;
