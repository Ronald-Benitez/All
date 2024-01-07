import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";

import useStyle from "@/src/zustand/useStyle";
import Confirm from "@/src/components/configs/Confirm";
import AddRegister from "./AddRegister";
import GroupHandler from "../../db/groupTables";
import ListHandler from "../../db/listTables";
import WithoutRegister from "./WithoutRegister";

export default function RegisterCard({
  register,
  reload,
  isDown,
  setIsDown,
  setRegister,
  savingsFlag,
  handleReload,
}) {
  const styles = useStyle((state) => state.style);
  const [balance, setBalance] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const db = new GroupHandler(savingsFlag ? "savingsGroup" : "registerGroup");
  const dbList = new ListHandler(savingsFlag ? "savingsList" : "registerList");

  useEffect(() => {
    if (register) setBalance(register.incomes - register.expenses);
  }, [register]);

  const handleDelete = async () => {
    db.deleteItem(register.id);
    dbList.deleteByGroup(register.id);
    reload();
    setRegister(null);
  };

  if (!register || !register?.id) return (
    <>
      <WithoutRegister
        reload={reload}
        savingsFlag={savingsFlag}
      />
    </>
  )

  return (
    <View
      style={[
        styles.block,
        {
          padding: 0,
        },
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: "95%",
            },
          ]}
          onPress={() => setIsDown(!isDown)}
        >
          {isDown ? (
            <Feather name="chevron-up" size={20} color="black" />
          ) : (
            <Feather name="chevron-down" size={20} color="black" />
          )}
        </TouchableOpacity>
      </View>
      {isDown && (
        <>
          <View style={styles.row}>
            <View style={[styles.detailsBlock, styles.income]}>
              <Text style={styles.income}>Incomes</Text>
              <Text style={[styles.sideLabel, styles.income]}>
                $ {register.incomes.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.detailsBlock, styles.goal]}>
              <Text style={styles.goal}>Goal</Text>
              <Text style={[styles.sideLabel, styles.goal]}>
                $ {register.goal.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.detailsBlock, styles.expense]}>
              <Text style={styles.expense}>Expenses</Text>
              <Text style={[styles.sideLabel, styles.expense]}>
                $ {register.expenses.toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                styles.detailsBlock,
                balance >= 0 ? styles.income : styles.expense,
              ]}
            >
              <Text style={balance >= 0 ? styles.income : styles.expense}>
                Balance
              </Text>
              <Text
                style={[
                  styles.sideLabel,
                  balance >= 0 ? styles.income : styles.expense,
                ]}
              >
                $ {(register.incomes - register.expenses).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <AddRegister
              actualRegister={register}
              reload={reload}
              handleReload={handleReload}
            >
              <Feather name="edit" size={20} color="black" />
            </AddRegister>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setConfirm(!confirm);
              }}
            >
              <Feather name="trash" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <Confirm
            visible={confirm}
            setVisible={setConfirm}
            title="Delete register"
            message="Are you sure you want to delete this register?"
            onConfirm={handleDelete}
            onCancel={() => setConfirm(!confirm)}
            confirmText="Delete"
            cancelText="Cancel"
          />
        </>
      )}
    </View>
  );
}
