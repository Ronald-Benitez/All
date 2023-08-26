import React from "react";
import { View, TouchableOpacity, Modal, Text } from "react-native";
import Picker from "react-native-wheel-color-picker";

const ColorPicker = ({
  newElement,
  styles,
  visible,
  setVisible,
  onColorChange,
}) => {
  return (
    <View>
      <Modal animationType="slide" transparent visible={visible}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setVisible(!visible)}
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
              onColorChangeComplete={onColorChange}
              color={newElement.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ColorPicker;
