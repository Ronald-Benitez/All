import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";

import getStyles from "@/src/styles/styles";
// import db from "@/src/db/registersGroupTable.js";
// import dbList from "@/src/db/registersListTable.js";
import Confirm from "@/src/components/configs/Confirm";
import AddRegister from "./AddRegister";
import GroupHandler from "../../db/groupTables";
import ListHandler from "../../db/listTables";

export default function RegisterCard({
  register,
  reload,
  setReload,
  handleReload,
  isDown,
  setIsDown,
  setRegister,
  savingsFlag,
}) {
  const [styles, setStyles] = useState({});
  const [balance, setBalance] = useState(0);
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const db = new GroupHandler(savingsFlag ? "savingsGroup" : "registerGroup");
  const dbList = new ListHandler(savingsFlag ? "savingsList" : "registerList");

  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
    if (register) setBalance(register.incomes - register.expenses);
  }, [register]);

  const handleDelete = async () => {
    await db.deleteItem(register.id);
    await dbList.deleteByGroup(register.id);
    setReload(!reload);
    setRegister(null);
  };

  if (!register || !register?.id) return null;

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
                $ {register.incomes}
              </Text>
            </View>
            <View style={[styles.detailsBlock, styles.goal]}>
              <Text style={styles.goal}>Goal</Text>
              <Text style={[styles.sideLabel, styles.goal]}>
                $ {register.goal}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.detailsBlock, styles.expense]}>
              <Text style={styles.expense}>Expenses</Text>
              <Text style={[styles.sideLabel, styles.expense]}>
                $ {register.expenses}
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => setEdit(!edit)}
            >
              <Feather name="edit" size={20} color="black" />
            </TouchableOpacity>
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
          <Modal visible={edit} transparent>
            <TouchableOpacity
              style={styles.modalBackdrop}
              onPress={() => setEdit(false)}
            >
              <View style={styles.modalContent}>
                <AddRegister
                  actualRegister={register}
                  handleReload={handleReload}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
    </View>
  );
}
