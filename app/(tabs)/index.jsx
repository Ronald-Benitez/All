import { View, ScrollView, Text } from "react-native";
import { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Cards from "../../src/components/Index/Cards";
import DailyCard from "@/src/components/pet/DailyCard";
import { initializeStyles } from "../slices/stylesSlice";

export default function TabOneScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const styles = useSelector((state) => state.styles.styles);

  useEffect(() => {
    dispatch(initializeStyles());
  }, []);

  if(!styles) return null;

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
          <Text style={[styles.title]}>{t("index.tools")}</Text>

          <View styles={styles.row}>
            <Cards
              title={t("index.giveaways")}
              route="tools/Giveaways"
              icon={() => <AntDesign name="gift" size={30} color="black" />}
              styles={styles}
            />
            <Cards
              title={t("index.configs")}
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
          <Text style={[styles.title]}>{t("index.days")}</Text>

          <View styles={styles.row}>
            <Cards
              title={t("index.days")}
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
          <Text style={[styles.title]}>{t("index.finances")}</Text>
          <View styles={styles.row}>
            <Cards
              title={t("index.finances")}
              route="Finances"
              icon={() => (
                <Ionicons name="wallet-outline" size={30} color="black" />
              )}
              styles={styles}
            />
            <Cards
              title={t("index.expense-adder")}
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
              title={t("index.savings")}
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
              title={t("index.profits")}
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
              title={t("index.budgets")}
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
