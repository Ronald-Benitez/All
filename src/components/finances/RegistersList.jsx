import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, FlatList, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment/moment";

import getStyles from "@/src/styles/styles";
import db from "@/src/db/registersListTable.js";
import dbGroup from "@/src/db/registersGroupTable.js";
import Confirm from "@/src/components/configs/Confirm";
import AddRegisterList from "./AddRegisterList";

export default function RegistersListCard({ group, setGroup, handleReload, isDown, setIsDown }) {
  const [styles, setStyles] = useState({});
  const [list, setList] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  useEffect(() => {
    if (!group || !group?.id) return setList([]);

    db.getByGroup(group.id).then((data) => {
      if (!data) return setList([]);
      setList(data);
    });
  }, [group]);

  const handleDelete = async () => {
    await db.deleteItem(selected.id);
    const newGroup = group;
    if (selected.type === "income") {
      newGroup.incomes -= selected.value;
      dbGroup.updateIncomes(newGroup.id, newGroup.incomes);
    }
    if (selected.type === "expense") {
      newGroup.expenses -= selected.value;
      dbGroup.updateExpenses(newGroup.id, newGroup.expenses);
    }
    setGroup(newGroup);
    dbGroup.getByYear(newGroup.year).then((data) => {
      handleReload(data, newGroup.id);
    });
  };

  if (!group) return null;

  return (
    <View
      style={[
        styles.block,
        {
          padding: 0,
          width: "95%",
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
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View key={item.id} style={[styles.row]}>
              <TouchableOpacity
                style={[
                  styles.registerBlock,
                  item.type === "income" ? styles.income : styles.expense,
                  {
                    width: "80%",
                    margin: 5,
                  },
                ]}
                onPress={() => {
                  setEdit(true);
                  setSelected(item);
                }}
              >
                <View style={styles.row}>
                  <Text
                    style={[
                      styles.dateVerticalSmall,
                      item.type === "income" ? styles.income : styles.expense,
                    ]}
                  >
                    {moment(item.date, "YYYY/MM/DD").format("DD")}
                  </Text>
                  <Text
                    style={[
                      styles.dateVerticalSmall,
                      item.type === "income" ? styles.income : styles.expense,
                    ]}
                  >
                    {moment(item.date, "YYYY/MM/DD").format("MMM")}
                  </Text>
                  <Text
                    style={[
                      styles.dateVerticalSmall,
                      item.type === "income" ? styles.income : styles.expense,
                    ]}
                  >
                    {moment(item.date, "YYYY/MM/DD").format("YYYY")}
                  </Text>
                </View>
                <Text
                  style={
                    item.type === "income" ? styles.income : styles.expense
                  }
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.sideLabel,
                    item.type === "income" ? styles.income : styles.expense,
                  ]}
                >
                  $ {item.value}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    margin: 0,
                    padding: 0,
                    marginRight: 5,
                  },
                ]}
                onPress={() => {
                  setConfirm(true);
                  setSelected(item);
                }}
              >
                <Feather name="trash-2" size={20} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <Confirm
        title="Delete"
        message="Are you sure you want to delete this item?"
        visible={confirm}
        setVisible={setConfirm}
        onConfirm={() => handleDelete()}
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setConfirm(false)}
      />

      <Modal transparent={true} visible={edit}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setEdit(false)}
        >
          <View style={styles.modalContent}>
            <AddRegisterList
              actualRegister={selected}
              handleReload={handleReload}
              group={group}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}