import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Storage } from "expo-storage";
import useStyle from "@/src/zustand/useStyle";
import Confirm from "@/src/components/configs/Confirm";

const ExpenseAdder = () => {
  const styles = useStyle((state) => state.style);
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [value, setValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [edit, setEdit] = useState(false);
  const [index, setIndex] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [reload, setReload] = useState(false);
  const [save, setSave] = useState(false);

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

  const addExpense = async (newExpense) => {
    setExpenses([...expenses, newExpense]);
    setTotal(total + newExpense.amount);
    clearInputs();
  };

  const removeExpense = async () => {
    const newExpenses = [...expenses];
    const removedExpense = newExpenses.splice(index, 1);
    setExpenses(newExpenses);
    setTotal(total - removedExpense[0].amount);
  };

  const editExpense = (index, newExpense) => {
    const newExpenses = [...expenses];
    const oldExpense = newExpenses.splice(index, 1);
    setExpenses([...newExpenses, newExpense]);
    setTotal(total - oldExpense[0].amount + newExpense.amount);
  };

  const handleEdit = (index) => {
    const newExpenses = [...expenses];
    const expense = newExpenses.splice(index, 1);
    setName(expense[0].name);
    setValue(expense[0].value);
    setQuantity(expense[0].quantity);
    setEdit(true);
    setIndex(index);
  };

  const clearInputs = () => {
    setName("");
    setValue(0);
    setQuantity(1);
    setEdit(false);
    setIndex("");
  };

  const clear = () => {
    setExpenses([]);
    setTotal(0);
    clearInputs();
  };

  const renderBtn = () => {
    if (edit) {
      return (
        <>
          <TouchableOpacity
            style={[styles.buttonBordered]}
            onPress={() => {
              editExpense(index, {
                name,
                value,
                quantity,
                amount: value * quantity,
              });
              clearInputs();
            }}
          >
            <MaterialCommunityIcons name="cart-check" size={15} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonBordered}
            onPress={() => {
              clearInputs();
            }}
          >
            <Feather name="x" size={15} color="black" />
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.buttonBordered}
          onPress={() => {
            addExpense({
              name: name,
              value: value,
              quantity: quantity,
              amount: value * quantity,
            });
          }}
        >
          <MaterialCommunityIcons name="cart-plus" size={15} color="black" />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.block, { padding: 0 }]}>
        <Text style={styles.title}>${total.toFixed(2)}</Text>
      </View>
      <View
        style={[
          styles.block,
          {
            height: "75%",
          },
        ]}
      >
        <View
          style={[
            styles.row,
            {
              height: 30,
            },
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
        <ScrollView>
          {expenses.map((expense, index) => {
            return (
              <View key={index} style={[styles.row]}>
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.row,
                    styles.primaryBorder,
                    {
                      width: "80%",
                      minHeight: 30,
                    },
                  ]}
                  onPress={() => {
                    handleEdit(index);
                  }}
                >
                  <View style={[styles.column, { flex: 2 }]}>
                    <Text style={styles.sideLabel}>{expense.name}</Text>
                  </View>
                  <View style={[styles.column, { flex: 1 }]}>
                    <Text style={styles.sideLabel}>${expense.value}</Text>
                  </View>
                  <View style={[styles.column, { flex: 1 }]}>
                    <Text style={styles.sideLabel}>{expense.quantity}</Text>
                  </View>
                  <View style={[styles.column, { flex: 1 }]}>
                    <Text style={styles.sideLabel}>${expense.amount}</Text>
                  </View>
                </TouchableOpacity>
                <View style={[styles.column, { flex: 1 }]}>
                  <TouchableOpacity
                    style={[
                      styles.buttonBordered,
                      {
                        width: "100%",
                        padding: 6,
                        alignItems: "center",
                      },
                    ]}
                    onPress={() => {
                      setConfirmVisible(true);
                      setIndex(index);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="cart-remove"
                      size={15}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View style={[styles.block, { padding: 2 }]}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.buttonBordered, { padding: 10 }]}
            onPress={() => {
              setReload(!reload);
            }}
          >
            <MaterialIcons name="loop" size={18} color="black" />
          </TouchableOpacity>
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
            <Text style={{ fontWeight: "100", padding: 0 }}>Calculate</Text>
          </View>
          <TouchableOpacity
            style={[styles.buttonBordered, { padding: 10 }]}
            onPress={() => {
              setSave(!save);
            }}
          >
            <MaterialCommunityIcons name="cart-plus" size={18} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Confirm
        onConfirm={removeExpense}
        onCancel={() => {
          setConfirmVisible(false);
        }}
        visible={confirmVisible}
        setVisible={setConfirmVisible}
        title="Remove Expense"
        message="Are you sure you want to remove this expense?"
        confirmText="Remove"
        cancelText="Cancel"
      />

      <Confirm
        onConfirm={clear}
        onCancel={() => {
          setReload(false);
        }}
        visible={reload}
        setVisible={setReload}
        title="Reload"
        message="Are you sure you want to reload?"
        confirmText="Reload"
        cancelText="Cancel"
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={save || edit}
        onRequestClose={() => {
          setSave(false);
          clearInputs();
        }}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => {
            setSave(false);
            clearInputs();
          }}
        >
          <View style={[styles.modalContent]}>
            <View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.sideLabel}>Value</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        minWidth: 100,
                      },
                    ]}
                    value={String(value)}
                    placeholder="Value"
                    onChangeText={(text) => setValue(text)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.column}>
                  <Text style={styles.sideLabel}>Quantity</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        minWidth: 100,
                      },
                    ]}
                    value={String(quantity)}
                    placeholder="Quantity"
                    onChangeText={(text) => setQuantity(text)}
                    keyboardType="numeric"
                  />
                </View>

              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.sideLabel}>Name</Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        minWidth: 175,
                        maxWidth: 200,
                      },
                    ]}
                    placeholder="Name"
                    onChangeText={(text) => setName(text)}
                    multiline={true}
                    value={name}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <View style={styles.row}>{renderBtn()}</View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ExpenseAdder;
