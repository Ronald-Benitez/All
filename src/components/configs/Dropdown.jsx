import { View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";

import getStyles from "@/src/styles/styles";

export default function Dropdown({ title, render, key = "dfk" }) {
  const [styles, setStyles] = useState({});
  const [see, setSee] = useState(false);

  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  return (
    <View
      style={[
        styles.block,
        {
          padding: 0,
          width: "95%",
        },
      ]}
      key={key}
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
      {see && render()}
    </View>
  );
}
