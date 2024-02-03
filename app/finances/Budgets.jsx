import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import moment from "moment/moment";
import { useSelector } from "react-redux";

import AddBudget from "@/src/components/finances/AddBudget";
import BudgetsList from "@/src/components/finances/BudgetsList";
import Filter from "@/src/components/ui/Filter";
import BudgetsCard from "../../src/components/finances/BudgetsCard";
import GroupSelector from "@/src/components/finances/GroupSelector";

const Budgets = () => {
  const styles = useSelector((state) => state.styles.styles);
  const [reload, setReload] = useState(false);
  const [year, setYear] = useState(moment().format("YYYY"));
  const [total, setTotal] = useState(0);
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
            <AddBudget
              reload={reload}
              setReload={setReload}
              setTotal={setTotal}
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
