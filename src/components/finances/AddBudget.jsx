import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { useState, useEffect } from "react";
import { MaterialCommunityIcons, Feather, AntDesign } from "@expo/vector-icons";

import useStyle from "@/src/zustand/useStyle";
import db from "@/src/db/budgetsTable";

const AddBudget = ({ reload, setReload, groupId, data }) => {
  const styles = useStyle((state) => state.style);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [quantity, setQuantity] = useState("");

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

  const clearInputs = () => {
    setName("");
    setValue("");
    setQuantity("");
  };

  const renderBtn = () => {
    if (data) {
      return (
        <>
          <TouchableOpacity
            style={[styles.buttonBordered]}
            onPress={() => {
              handleSave();
              clearInputs();
            }}
          >
            <Feather name="check" size={15} color="black" />
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
      <View style={styles.block}>
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
          <View style={styles.column}>
            <Text style={styles.sideLabel}>Value</Text>
            <TextInput
              style={[
                styles.input,
                {
                  minWidth: 90,
                },
              ]}
              value={String(value)}
              placeholder="Value"
              onChangeText={(text) => setValue(text)}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.row}>
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
          <View style={styles.column}>
            <Text style={styles.sideLabel}>Amount</Text>
            <Text
              style={[
                styles.input,
                {
                  minWidth: 100,
                },
              ]}
            >
              ${value * quantity}
            </Text>
          </View>
        </View>
        <View style={styles.row}>{renderBtn()}</View>
      </View>
    </>
  );
};

export default AddBudget;
