import { View } from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Cards from "../../src/components/Index/Cards";
import getStyles from "@/src/styles/styles";

export default function TabOneScreen() {
  const [styles, setStyles] = useState({});
  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Cards title="Giveaways" route="Giveaways" />
        <Cards title="Configs" route="Configs" />
      </View>
      <View style={styles.row}>
        <Cards title="Days" route="Days" />
        <Cards title="Finances" route="Finances" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   col50: {
//     width: "50%",
//   },
// });
