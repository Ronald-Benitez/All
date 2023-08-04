import { View, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import Cards from "../../src/components/Index/Cards";
import getStyles from "@/src/styles/styles";
import DailyCard from "@/src/components/pet/DailyCard";

export default function TabOneScreen() {
  const [styles, setStyles] = useState({});
  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          height: "100%",
        },
      ]}
    >
      <DailyCard />
      <ScrollView
        style={{
          width: "100%",
          maxHeight: "35%",
        }}
      >
        <View
          style={[
            styles.block,
            {
              width: "100%",
              padding: 0,
            },
          ]}
        >
          <Text style={[styles.title]}>Tools</Text>

          <View styles={styles.row}>
            <Cards
              title="Giveaways"
              route="Giveaways"
              icon={() => <AntDesign name="gift" size={30} color="black" />}
            />
            <Cards
              title="Configs"
              route="Configs"
              icon={() => <Octicons name="gear" size={30} color="black" />}
            />
          </View>
        </View>
        <View
          style={[
            styles.block,
            {
              width: "100%",
              padding: 0,
            },
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
            />
          </View>
        </View>
        <View
          style={[
            styles.block,
            {
              width: "100%",
              padding: 0,
            },
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
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
