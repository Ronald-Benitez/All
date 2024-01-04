import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment/moment";

import useStyle from "@/src/zustand/useStyle";
import DatePicker from "@/src/components/configs/DatePicker.jsx";
import ListHandler from "../../db/listTables";
import GroupHandler from "../../db/groupTables";

export default function AddRegisterList({
  group,
  actualRegister,
  handleReload,
  setRegister,
  savingsFlag,
}) {
  const styles = useStyle((state) => state.style);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState(moment().format("YYYY/MM/DD"));

  const db = new ListHandler(savingsFlag ? "savingsList" : "registerList");
  const dbGroup = new GroupHandler(savingsFlag ? "savingsGroup" : "registerGroup");

  useEffect(() => {
    if (actualRegister) {
      setName(actualRegister.name);
      setValue(actualRegister.value);
      setType(actualRegister.type);
      setDate(actualRegister.date);
    }
  }, [actualRegister]);

  const verifyFields = () => {
    if (name && value) return true;
    return false;
  };

  const handleReloadGroup = () => {
    db.getByGroup(group.id).then((data) => {
      let expenses = 0;
      let incomes = 0;
      data.forEach((item) => {
        if (item.type == "expense") {
          expenses += parseFloat(item.value);
        } else {
          incomes += parseFloat(item.value);
        }
      });
      dbGroup.updateExpenses(group.id, expenses);
      dbGroup.updateIncomes(group.id, incomes);
      dbGroup.getByYear(group.year).then((data) => {
        handleReload(data, group.id);
      });
    });
  };

  const handleSave = async () => {
    if (!verifyFields()) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    if (actualRegister) {
      db.updateItem(actualRegister.id, name, date, value, type);
      db.getByGroup(group.id).then(() => {
        handleReloadGroup();
      });
      Alert.alert("Success", "Register edited");
    } else {
      db.insertItem(name, date, value, type, group.id);
      setName("");
      setValue("");
      setType("expense");

      if (type == "expense") {
        dbGroup.updateExpenses(group.id, group.expenses + parseFloat(value));
      } else {
        dbGroup.updateIncomes(group.id, group.incomes + parseFloat(value));
      }
      dbGroup.getItem(group.id).then((data) => {
        setRegister(data);
      });
      Alert.alert("Success", "Register added");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {actualRegister ? "Edit register item" : "Add register item"}
      </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setName(text)}
          value={name}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Value</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setValue(text)}
          value={String(value)}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Type</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            setType(type == "expense" ? "income" : "expense");
          }}
        >
          <Text style={styles.buttonText}>{type}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <DatePicker value={date} onChange={setDate} />
      </View>
      <TouchableOpacity style={[styles.buttonBordered]} onPress={handleSave}>
        <Feather name="save" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
