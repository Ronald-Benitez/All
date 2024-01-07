import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment/moment";

import useStyle from "@/src/zustand/useStyle";
import TableHandler from "../../db/groupTables";
import MonthPicker from "../ui/MonthPicker";

export default function AddRegister({
  reload,
  actualRegister,
  handleReload,
  savingsFlag,
  children
}) {
  const styles = useStyle((state) => state.style);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [seeModal, setSeeModal] = useState(false);
  const [month, setMonth] = useState(moment().format("MM"));
  const [year, setYear] = useState(moment().format("YYYY"));
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
      db.updateBaseData(actualRegister.id, name, goal);
      db.getByYear(actualRegister.year).then((data) => {
        handleReload(data, actualRegister.id);
      });
      Alert.alert("Success", "Register group updated");
    } else {
      db.insertItem(name, month, year, 0, 0, goal);
      setName("");
      setGoal("");
      reload();
      Alert.alert("Success", "Register group added");
    }
    setSeeModal(false);
  };

  const verifyFields = () => {
    if (name && goal) return true;
    return false;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setSeeModal(true)}
      >
        {children }
      </TouchableOpacity>
      <Modal visible={seeModal} transparent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSeeModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.container}>
              <Text style={styles.title}>
                {actualRegister ? "Edit register group" : "Add register group"}
              </Text>

              <View style={[styles.row, { justifyContent: "space-between", width: "80%" }]}>
                <MonthPicker month={month} onChange={setMonth} />
                <TextInput
                  style={[styles.input, { minWidth: 100, textAlign: "center" }]}
                  value={year}
                  onChangeText={setYear}
                  placeholder="Year"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.row, { justifyContent: "space-between", width: "80%" }]}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setName(text)}
                  value={name}
                />
              </View>
              <View style={[styles.row, { justifyContent: "space-between", width: "80%" }]}>
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
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
