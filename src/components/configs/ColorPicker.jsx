import { useState, useEffect } from "react";
import { View, TouchableOpacity, Modal, Text, StyleSheet } from "react-native";
import Picker from "react-native-wheel-color-picker";

import getStyles from "@/src/styles/styles";

const ColorPicker = ({ base, setNewElement, newElement }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState(base);
  const [styles, setStyles] = useState({});

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setNewElement({
      ...newElement,
      value: color,
    });
  };

  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  useEffect(() => {
    setSelectedColor(base);
  }, [base]);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View
          style={[styles.colorPreview, { backgroundColor: selectedColor }]}
        />
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <View
            style={[
              styles.modalContent,
              {
                height: "50%",
              },
            ]}
          >
            <Picker
              onColorChangeComplete={handleColorSelect}
              color={newElement.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ColorPicker;
