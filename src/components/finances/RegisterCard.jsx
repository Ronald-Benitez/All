import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import useStyle from "@/src/zustand/useStyle";
import Confirm from "@/src/components/configs/Confirm";
import AddRegister from "./AddRegister";
import GroupHandler from "../../db/groupTables";
import ListHandler from "../../db/listTables";
import WithoutRegister from "./WithoutRegister";

export default function RegisterCard({
  register,
  reload,
  isDown,
  setIsDown,
  setRegister,
  savingsFlag,
  handleReload,
  year,
}) {
  const styles = useStyle((state) => state.style);
  const [balance, setBalance] = useState(0);
  const { t } = useTranslation();
  const db = new GroupHandler(savingsFlag ? "savingsGroup" : "registerGroup");
  const dbList = new ListHandler(savingsFlag ? "savingsList" : "registerList");

  useEffect(() => {
    if (register) setBalance(register.incomes - register.expenses);
  }, [register]);

  const handleDelete = async () => {
    db.deleteItem(register.id);
    dbList.deleteByGroup(register.id);
    reload();
    setRegister(null);
  };

  if (!register || !register?.id) return (
    <>
      <WithoutRegister
        reload={reload}
        savingsFlag={savingsFlag}
        year={year}
      />
    </>
  )

  return (
    <View
      style={[
        styles.block,
        { padding: 0, },
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.button,
            { width: "95%", },
          ]}
          onPress={() => setIsDown(!isDown)}
        >
          {isDown ? (
            <Feather name="chevron-up" size={20} color="black" />
          ) : (
            <Feather name="chevron-down" size={20} color="black" />
          )}
        </TouchableOpacity>
      </View>
      {isDown && (
        <>
          <View style={styles.row}>
            <View style={[styles.detailsBlock, styles.income]}>
              <Text style={styles.income}>{t("finances-feature.income")}</Text>
              <Text style={[styles.sideLabel, styles.income]}>
                $ {register.incomes.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.detailsBlock, styles.goal]}>
              <Text style={styles.goal}>{t("finances-feature.goal")}</Text>
              <Text style={[styles.sideLabel, styles.goal]}>
                $ {register.goal.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.detailsBlock, styles.expense]}>
              <Text style={styles.expense}>{t("finances-feature.expenses")}</Text>
              <Text style={[styles.sideLabel, styles.expense]}>
                $ {register.expenses.toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                styles.detailsBlock,
                balance >= 0 ? styles.income : styles.expense,
              ]}
            >
              <Text style={balance >= 0 ? styles.income : styles.expense}>
              {t("finances-feature.balance")}
              </Text>
              <Text
                style={[
                  styles.sideLabel,
                  balance >= 0 ? styles.income : styles.expense,
                ]}
              >
                $ {(register.incomes - register.expenses).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <AddRegister
              actualRegister={register}
              reload={reload}
              handleReload={handleReload}
            >
              <Feather name="edit" size={20} color="black" />
            </AddRegister>
            <Confirm
              title={t("finances-feature.d-r-title")}
              message={t("finances-feature.d-r-msg")}
              onConfirm={handleDelete}
            >
              <View style={styles.button}>
                <Feather name="trash" size={20} color="black" />
              </View>
            </Confirm>
          </View>
        </>
      )}
    </View>
  );
}
