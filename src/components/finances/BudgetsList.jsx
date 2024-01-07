import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { useEffect, useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";

import db from "@/src/db/budgetsTable";
import useStyle from "@/src/zustand/useStyle";
import AddBudget from "./AddBudget";
import Confirm from "@/src/components/configs/Confirm";

const BudgetsList = ({ groupId, setTotal, setReload, reload, filter }) => {
  const [budgets, setBudgets] = useState([]);
  const styles = useStyle((state) => state.style);
  const [edit, setEdit] = useState(false);
  const [actualBudget, setActualBudget] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    if (!filter || filter.length <= 0) {
      setFilteredList([]);
      return setTotal(
        budgets.reduce((acc, item) => acc + parseFloat(item.amount), 0)
      );
    }
    const newFilteredList = budgets.filter((item) => filter.some((f) => item.name.toLowerCase().includes(f)));
    setFilteredList(newFilteredList);
    setTotal(
      newFilteredList.reduce((acc, item) => acc + parseFloat(item.amount), 0)
    );
  }, [filter, budgets]);

  useEffect(() => {
    db.getByGroup(groupId).then((data) => {
      setBudgets(data);
      setTotal(data.reduce((acc, item) => acc + parseFloat(item.amount), 0));
    });
  }, [groupId, reload]);

  const handleDelete = async () => {
    await db.deleteItem(actualBudget.id);
    setReload(!reload);
  };

  if (!groupId || groupId === "") return

  if (budgets.length <= 0) return (
    <>
      <View
        style={[
          styles.block,
          { padding: 0, minWidth: "90%", },
        ]}
      >
        <Text style={[styles.sideLabel, { padding: 10 }]}>
          Budget, finance and profits use the same group by default, enter a
          budgeted item to get started
        </Text>
        <AddBudget
          groupId={groupId}
          setReload={setReload}
          reload={reload}
          style={styles.button}
        >
          <AntDesign name="addfile" size={20} color="black" />
        </AddBudget>
      </View>
    </>
  )

  return (
    <View
      style={[
        styles.block,
        { minWidth: "99%", padding: 7, },
      ]}
    >
      <View
        style={[
          styles.row,
          { height: 30, },
        ]}
      >
        <View style={[styles.column, { flex: 2 }]}>
          <Text style={[styles.sideLabel]}>Name</Text>
        </View>
        <View style={[styles.column, { flex: 1 }]}>
          <Text style={[styles.sideLabel]}>$</Text>
        </View>
        <View style={[styles.column, { flex: 1 }]}>
          <Text style={[styles.sideLabel]}>#</Text>
        </View>
        <View style={[styles.column, { flex: 1 }]}>
          <Text style={[styles.sideLabel]}>Total</Text>
        </View>
        <View style={[styles.column, { flex: 1 }]}>
          <Text style={[styles.sideLabel]}></Text>
        </View>
      </View>
      <FlatList
        data={filteredList.length > 0 ? filteredList : budgets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View key={item.id} style={[styles.row]}>
            <AddBudget
              groupId={groupId}
              setReload={setReload}
              reload={reload}
              data={item}
              style={[
                styles.row,
                styles.primaryBorder,
                { width: "85%", minHeight: 30, },
              ]}
            >
              <View style={[styles.row, { minHeight: 45 }]}>
                <View style={[styles.column, { flex: 2 }]}>
                  <Text style={[styles.text]}>{item.name}</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                  <Text style={[styles.text]}>$ {item.value}</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                  <Text style={[styles.text]}>{item.quantity}</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                  <Text style={[styles.text]}>$ {item.amount}</Text>
                </View>
              </View>
            </AddBudget>
            <View style={[styles.column, { flex: 1 }]}>
              <TouchableOpacity
                onPress={() => {
                  setActualBudget(item);
                  setDeleteModal(true);
                }}
                style={[
                  styles.buttonBordered,
                  {
                    width: "100%",
                    padding: 6,
                    alignItems: "center",
                  },
                ]}
              >
                <Feather name="trash-2" size={15} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Modal
        visible={edit}
        transparent
        animationType="slide"
        onRequestClose={() => setEdit(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setEdit(false)}
        >
          <View style={styles.modalContainer}>
            <AddBudget
              groupId={groupId}
              setReload={setReload}
              reload={reload}
              data={actualBudget}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      <Confirm
        visible={deleteModal}
        setVisible={setDeleteModal}
        onConfirm={handleDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget?"
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteModal(false)}
      />
    </View>
  );
};

export default BudgetsList;
