import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

import useStyle from "@/src/zustand/useStyle";
import TableHandler from "../../db/groupTables";

export default function AddRegister({
  reload,
  setReload,
  month,
  year,
  actualRegister,
  handleReload,
  savingsFlag,
}) {
  const styles = useStyle((state) => state.style);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const db = new TableHandler(savingsFlag ? "savingsGroup" : "registerGroup");

  useEffect(() => {
    if (actualRegister) {
      setName(actualRegister.name);
      setGoal(actualRegister.goal.toString());
    }
  }, [actualRegister]);

  const handleSave = async () => {
    if (!verifyFields()) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    if (actualRegister) {
      await db.updateBaseData(actualRegister.id, name, goal);
      db.getByYear(actualRegister.year).then((data) => {
        handleReload(data, actualRegister.id);
      });
      Alert.alert("Success", "Register group updated");
    } else {
      db.insertItem(name, month, year, 0, 0, goal);
      setName("");
      setGoal("");
      setReload(!reload);
      Alert.alert("Success", "Register group added");
    }
  };

  const verifyFields = () => {
    if (name && goal) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {actualRegister ? "Edit register group" : "Add register group"}
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
        <Text style={styles.label}>Goal</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setGoal(text)}
          value={goal}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={[styles.buttonBordered]} onPress={handleSave}>
        <Feather name="save" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
