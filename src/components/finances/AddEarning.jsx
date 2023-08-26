import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment/moment";

import getStyles from "@/src/styles/styles";
import db from "@/src/db/earningsTable";
import DatePicker from "@/src/components/configs/DatePicker.jsx";

export default function AddEarning({
  groupId,
  setReload,
  reload,
  actualEarning,
}) {
  const [styles, setStyles] = useState({});
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(moment().format("YYYY/MM/DD"));

  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  useEffect(() => {
    if (actualEarning) {
      setName(actualEarning.name);
      setAmount(actualEarning.amount.toString());
      setDate(actualEarning.date);
    }
  }, [actualEarning]);

  const verifyFields = () => {
    if (name && amount) return true;
    return false;
  };

  const handleSave = async () => {
    if (!verifyFields()) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }
    if (actualEarning) {
      await db.updateItem(
        actualEarning.id,
        date,
        name,
        amount,
        actualEarning.group_id
      );
      setReload(!reload);
      Alert.alert("Success", "Earning updated");
    } else {
      db.insertItem(date, name, amount, groupId);
      setName("");
      setAmount("");
      setReload(!reload);
      Alert.alert("Success", "Earning added");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {actualEarning ? "Edit " : "Add "}earning
      </Text>
      <View style={[styles.row]}>
        <Text style={styles.label}>Date</Text>
        <DatePicker value={date} onChange={setDate} />
      </View>
      <View style={[styles.row]}>
        <Text style={styles.label}>Name{"    "}</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
        />
      </View>
      <View style={[styles.row]}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={[styles.buttonBordered]} onPress={handleSave}>
        <Feather name="save" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
