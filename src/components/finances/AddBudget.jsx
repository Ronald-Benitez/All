import { View, Text, TouchableOpacity, TextInput, Alert, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";

import useStyle from "@/src/zustand/useStyle";
import db from "@/src/db/budgetsTable";

const AddBudget = ({ reload, setReload, groupId, data, children, style }) => {
  const styles = useStyle((state) => state.style);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [seeAdd, setSeeAdd] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setValue(data.value);
      setQuantity(data.quantity);
    }
  }, [data]);

  const handleSave = async () => {
    if (name !== "" && value !== "" && quantity !== "") {
      if (data) {
        await db.updateItem(
          data.id,
          name,
          value * quantity,
          quantity,
          value,
          groupId
        );
        setReload(!reload);
        clearInputs();
      } else {
        await db.insertItem(name, value * quantity, quantity, value, groupId);
        setReload(!reload);
        clearInputs();
      }
    } else {
      Alert.alert("Error", "Please fill all the fields");
    }
  };

  const renderBtn = () => {
    if (data) {
      return (
        <>
          <TouchableOpacity
            style={[styles.buttonBordered]}
            onPress={() => {
              handleSave();
              setSeeAdd(false)
            }}
          >
            <Feather name="check" size={15} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonBordered}
            onPress={() => {
              setSeeAdd(false)
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
            handleSave();
          }}
        >
          <AntDesign name="plus" size={15} color="black" />
        </TouchableOpacity>
      );
    }
  };

  return (
    <>
      <TouchableOpacity
        style={style}
        onPress={() => setSeeAdd(true)}
      >
        {children}
      </TouchableOpacity>
      <Modal visible={seeAdd} transparent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSeeAdd(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>Add Budget</Text>
            <View style={styles.block}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.sideLabel}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Name"
                    onChangeText={(text) => setName(text)}
                    multiline={true}
                    value={name}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.sideLabel}>Value</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { minWidth: 120 },
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
                      { minWidth: 120 },
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
                  <Text style={styles.sideLabel}>Amount</Text>
                  <Text
                    style={styles.input}
                  >
                    ${(value * quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>{renderBtn()}</View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

    </>
  );
};

export default AddBudget;
