import React, { useState } from "react";
import { View, TouchableOpacity, Modal, Text, StyleSheet } from "react-native";
import Picker from "react-native-wheel-color-picker";

const ColorPicker = ({ base, setNewElement, newElement }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(base);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setNewElement({
      ...newElement,
      value: color,
    });
    // Aquí puedes manejar la lógica cuando se selecciona un color
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View
          style={[styles.colorPreview, { backgroundColor: selectedColor }]}
        />
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.picker}>
            <Picker
              onColorChangeComplete={handleColorSelect}
              color={newElement.value}
            />
          </View>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  colorPreview: {
    width: 100,
    height: 30,
    margin: 2,
    borderWidth: 0.5,
    borderColor: "black",
    marginEnd: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  picker: {
    width: "90%",
    height: "50%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
  },
  colorItem: {
    width: 50,
    height: 50,
    margin: 5,
    borderWidth: 1,
    borderColor: "black",
  },
  closeButton: {
    marginTop: 20,
    fontSize: 18,
    color: "black",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
  },
});

export default ColorPicker;
