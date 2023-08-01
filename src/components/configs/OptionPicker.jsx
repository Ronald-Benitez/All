import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Entypo } from "@expo/vector-icons";

import getStyles from "@/src/styles/styles";

export default OptionPicker = ({ value, onChange, options, color }) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [styles, setStyles] = useState({});

  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  useEffect(() => {
    setSelectedValue(options[value]?.label || "");
  }, [value]);

  const togglePicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  const handleOptionPress = (option) => {
    setSelectedValue(options[option].label);
    setIsPickerVisible(false);
    onChange(option);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={togglePicker}
        style={[styles.button, color, styles.row]}
      >
        <Text style={styles.buttonText}>
          {selectedValue || "Select an option"}
        </Text>
        <Entypo name="chevron-small-down" size={15} color="black" />
      </TouchableOpacity>
      <Modal visible={isPickerVisible} transparent>
        <TouchableOpacity style={styles.modalBackdrop} onPress={togglePicker}>
          <View style={styles.modalContent}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleOptionPress(option.value)}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
