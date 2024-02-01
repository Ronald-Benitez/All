import { View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function Dropdown({ title, children }) {
  const styles = useSelector((state) => state.styles.styles);
  const [see, setSee] = useState(false);

  return (
    <View
      style={[
        styles.block,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: "100%",
            marginTop: 0,
            padding: 0,
          },
        ]}
        onPress={() => setSee(!see)}
      >
        <View style={styles.column}>
          <Text style={[styles.title]}>{title}</Text>
          {see ? (
            <Feather name="chevron-up" size={20} color="black" />
          ) : (
            <Feather name="chevron-down" size={20} color="black" />
          )}
        </View>
      </TouchableOpacity>
      {see && children}
    </View>
  );
}
