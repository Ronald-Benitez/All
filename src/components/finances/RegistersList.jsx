import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, FlatList, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment/moment";

import useStyle from "@/src/zustand/useStyle";
import Confirm from "@/src/components/configs/Confirm";
import AddRegisterList from "./AddRegisterList";
import ListHandler from "../../db/listTables";
import GroupHandler from "../../db/groupTables";

export default function RegistersListCard({
  group,
  savingsFlag,
  setGroup,
  handleReload,
  isDown,
  setIsDown,
  filter,
}) {
  const styles = useStyle((state) => state.style);
  const [list, setList] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [edit, setEdit] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [total, setTotal] = useState(0);
  const db = new ListHandler(savingsFlag ? "savingsList" : "registerList");
  const dbGroup = new GroupHandler(
    savingsFlag ? "savingsGroup" : "registerGroup"
  );


  useEffect(() => {
    if (!filter || filter.trim() === "") {
      setFilteredList([]);
      return;
    }

    const filters = filter.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (filters.length === 0) {
      setFilteredList([]);
      return;
    }

    const newFilteredList = list.filter((item) =>
      filters.some((f) => item.name.toLowerCase().includes(f))
    );

    setFilteredList(newFilteredList);
  }, [filter, list]);

  useEffect(() => {
    if (filteredList.length > 0) {
      handleSum(filteredList);
    }
  }, [filteredList]);

  useEffect(() => {
    if (!group?.id) {
      setList([]);
      return;
    }

    db.getByGroup(group.id)
      .then((data) => setList(data || []))
      .catch(() => setList([]));
  }, [group]);


  const handleSum = (newList) => {
    setTotal(
      newList.reduce((acc, item) => {
        return acc + (item.type === "income" ? parseFloat(item.value) : -parseFloat(item.value));
      }, 0)
    );
  };

  const handleDelete = async () => {
    db.deleteItem(selected.id);

    const newGroup = { ...group }; 

    if (selected.type === "income") {
      newGroup.incomes -= selected.value;
      dbGroup.updateIncomes(newGroup.id, newGroup.incomes);
    } else if (selected.type === "expense") {
      newGroup.expenses -= selected.value;
      dbGroup.updateExpenses(newGroup.id, newGroup.expenses);
    }

    setGroup(newGroup);

    dbGroup.getByYear(newGroup.year)
      .then((data) => handleReload(data, newGroup.id));
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
            styles.row,
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
      {filteredList.length > 0 && (
        <View style={styles.row}>
          <Text style={styles.sideLabel}>Filtered:</Text>
          <Text style={styles.sideLabel}>{total}</Text>
        </View>
      )}
      {isDown && (
        <FlatList
          data={filteredList.length > 0 ? filteredList : list}
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
                  {["DD", "MMM", "YYYY"].map((format, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.dateVerticalSmall,
                        item.type === "income" ? styles.income : styles.expense,
                      ]}
                    >
                      {moment(item.date, "YYYY/MM/DD").format(format)}
                    </Text>
                  ))}
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
              savingsFlag={savingsFlag}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
