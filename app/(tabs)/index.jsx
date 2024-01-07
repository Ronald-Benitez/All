import { View, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Cards from "../../src/components/Index/Cards";
import getStyles from "@/src/styles/styles";
import DailyCard from "@/src/components/pet/DailyCard";
import useStyle from "@/src/zustand/useStyle";

export default function TabOneScreen() {
  const [styles, setStyles] = useState({});
  const setStyle = useStyle((state) => state.setStyle);
  const storedStyle = useStyle((state) => state.style);

  useEffect(() => {
    if (storedStyle !== null && storedStyle !== undefined) {
      setStyles(storedStyle);
    } else {
      getStyles().then((data) => {
        setStyles(data);
        setStyle(data);
      });
    }
  }, [storedStyle]);

  return (
    <View
      style={[
        styles.container,
        {
          height: "100%",
        },
      ]}
    >
      <DailyCard styles={styles} />
      <ScrollView
        style={{
          width: "100%",
          marginTop: 10,
        }}
      >
        <View
          style={[
            styles.block,
            { width: "100%" },
          ]}
        >
          <Text style={[styles.title]}>Tools</Text>

          <View styles={styles.row}>
            <Cards
              title="Giveaways"
              route="tools/Giveaways"
              icon={() => <AntDesign name="gift" size={30} color="black" />}
              styles={styles}
            />
            <Cards
              title="Configs"
              route="Configs"
              icon={() => <Octicons name="gear" size={30} color="black" />}
              styles={styles}
            />
          </View>
        </View>
        <View
          style={[
            styles.block,
            { width: "100%" },
          ]}
        >
          <Text style={[styles.title]}>Days</Text>

          <View styles={styles.row}>
            <Cards
              title="Days"
              route="Days"
              icon={() => (
                <Ionicons name="ios-today-outline" size={30} color="black" />
              )}
              styles={styles}
            />
          </View>
        </View>
        <View
          style={[
            styles.block,
            { width: "100%" },
          ]}
        >
          <Text style={[styles.title]}>Finances</Text>
          <View styles={styles.row}>
            <Cards
              title="Finances"
              route="Finances"
              icon={() => (
                <Ionicons name="wallet-outline" size={30} color="black" />
              )}
              styles={styles}
            />
            <Cards
              title="Expense Adder"
              route="finances/ExpenseAdder"
              icon={() => (
                <MaterialCommunityIcons
                  name="trending-down"
                  size={30}
                  color="black"
                />
              )}
              styles={styles}
            />
            <Cards
              title="Savings"
              route="finances/Savings"
              icon={() => (
                <MaterialCommunityIcons
                  name="piggy-bank-outline"
                  size={30}
                  color="black"
                />
              )}
            />
            <Cards
              title="Profits"
              route="finances/Profits"
              icon={() => (
                <MaterialCommunityIcons
                  name="finance"
                  size={30}
                  color="black"
                />
              )}
              styles={styles}
            />
            <Cards
              title="Budgets"
              route="finances/Budgets"
              icon={() => (
                <Ionicons name="calculator-outline" size={30} color="black" />
              )}
              styles={styles}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
