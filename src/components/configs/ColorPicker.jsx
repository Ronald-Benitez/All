import { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  ToastAndroid,
  TextInput,
} from "react-native";
import Picker from "react-native-wheel-color-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";


const ColorPicker = ({
  newElement,
  styles,
  visible,
  setVisible,
  onColorChange,
}) => {
  const [color, setColor] = useState(newElement.value);

  const handleCopy = () => {
    //Function to copy on the clipboard the color code
    Clipboard.setStringAsync(color);
    ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
  };

  const handlePaste = async () => {
    //Function to paste the color code from the clipboard
    const color = await Clipboard.getStringAsync();
    if (verifyValidHex(color)) {
      setColor(color);
      onColorChange(color);
      ToastAndroid.show("Color pasted", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Invalid color code", ToastAndroid.SHORT);
    }
  };


  const handleChangeHex = (color) => {
    setColor(color);
    setTimeout(() => {
      if (verifyValidHex(color)) {
        onColorChange(color);
        ToastAndroid.show("Color changed", ToastAndroid.SHORT);
      }
    }, 1000);
  };

  const verifyValidHex = (color) => {
    //Function to verify if the color code is valid
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return regex.test(color);
  };

  useEffect(() => {
    setColor(newElement.value);
  }, [newElement]);

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
            <View style={styles.row}>
              <TouchableOpacity onPress={handlePaste}>
                <MaterialCommunityIcons
                  name="content-paste"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.sideLabel]}
                value={color}
                onChangeText={handleChangeHex}
              />
              <TouchableOpacity onPress={handleCopy}>
                <MaterialCommunityIcons
                  name="content-copy"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <Picker
              onColorChangeComplete={(color) => {
                onColorChange(color);
                setColor(color);
              }}
              color={verifyValidHex(color) ? color : newElement.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ColorPicker;
