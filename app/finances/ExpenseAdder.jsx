import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Storage } from "expo-storage";
import { useTranslation } from "react-i18next";

import useStyle from "@/src/zustand/useStyle";
import Confirm from "@/src/components/configs/Confirm";
import ExpenseList from "@/src/components/expense-adder/ExpenseList";
import AddExpense from "@/src/components/expense-adder/AddExpense";

const ExpenseAdder = () => {
  const styles = useStyle((state) => state.style);
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    Storage.getItem({
      key: "expenses",
    }).then((data) => {
      if (data) {
        setExpenses(JSON.parse(data));
      }
    });
  }, []);

  useEffect(() => {
    Storage.setItem({
      key: "expenses",
      value: JSON.stringify(expenses),
    });
    handleSumExpenses();
  }, [expenses]);

  const handleSumExpenses = () => {
    const sum = expenses.reduce((acc, expense) => {
      return acc + expense.amount;
    }, 0);
    setTotal(sum);
  }

  const clear = () => {
    setExpenses([]);
    setTotal(0);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.block, { padding: 0 }]}>
        <Text style={styles.title}>${total.toFixed(2)}</Text>
      </View>
      <ExpenseList expenses={expenses} setExpenses={setExpenses} />
      <View style={[styles.block, { padding: 2 }]}>
        <View style={styles.row}>
          <Confirm
            onConfirm={clear}
            title={t("expense-adder.clear-title")}
            message={t("expense-adder.clear-msg")}
          >
            <View
              style={[styles.buttonBordered, { padding: 10 }]}
            >
              <MaterialIcons name="loop" size={18} color="black" />
            </View>
          </Confirm>
          <View style={styles.column}>
            <TouchableOpacity
              style={[styles.buttonBordered, { padding: 10 }]}
              onPress={() => {
                handleSumExpenses();
              }}
            >
              <MaterialCommunityIcons
                name="cart-arrow-down"
                size={18}
                color="black"
              />
            </TouchableOpacity>
            <Text style={{ fontWeight: "100", padding: 0 }}>{t("expense-adder.calculate")}</Text>
          </View>
          <AddExpense list={expenses} setList={setExpenses} >
            <View
              style={[styles.buttonBordered, { padding: 10 }]}
            >
              <MaterialCommunityIcons name="cart-plus" size={18} color="black" />
            </View>
          </AddExpense>
        </View>
      </View>

    </View>
  );
};

export default ExpenseAdder;
