import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import useStyle from "@/src/zustand/useStyle";

export default OptionPicker = ({ value, onChange, options, color }) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const styles = useStyle((state) => state.style);
  const { t } = useTranslation();

  useEffect(() => {
    setSelectedValue(options[value]?.label || "");
  }, [value, options]);

  const togglePicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  const handleOptionPress = (option) => {
    setSelectedValue(options[option].label);
    setIsPickerVisible(false);
    onChange(options[option].value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={togglePicker}
        style={[styles.button, color, styles.row]}
      >
        <Text style={styles.buttonText}>
          {selectedValue || t("options-picker.label")}
        </Text>
        <Entypo name="chevron-small-down" size={15} color="black" />
      </TouchableOpacity>
      <Modal visible={isPickerVisible} transparent>
        <TouchableOpacity style={styles.modalBackdrop} onPress={togglePicker}>
          <View style={styles.modalContent}>
            {options.length > 0 ?
              options.map((option, key) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleOptionPress(key)}
                >
                  <Text style={styles.optionText}>{option.label}</Text>
                </TouchableOpacity>
              ))
              :
              <Text style={styles.optionText}>{t("options-picker.no-options")}</Text>
            }
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
