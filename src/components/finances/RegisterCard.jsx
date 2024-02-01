import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Confirm from "@/src/components/configs/Confirm";
import AddRegister from "./AddRegister";
import GroupHandler from "../../db/groupTables";
import ListHandler from "../../db/listTables";
import WithoutRegister from "./WithoutRegister";
import { setGroup } from "@/app/slices/groupSlice";

export default function RegisterCard({
  reload,
  isDown,
  setIsDown,
  handleReload,
  year,
}) {
  const styles = useSelector((state) => state.styles.styles);
  const [balance, setBalance] = useState(0);
  const { t } = useTranslation();
  const type = useSelector((state) => state.group.type);
  const group = useSelector((state) => state.group.group);
  const db = new GroupHandler(type.group || "registerGroup");
  const dbList = new ListHandler(type.list || "registerList");
  const dispatch = useDispatch();

  useEffect(() => {
    if (group) setBalance(group.incomes - group.expenses);
  }, [group]);

  const handleDelete = async () => {
    db.deleteItem(group.id);
    dbList.deleteByGroup(group.id);
    dispatch(setGroup(null));
    reload();
  };

  const handleRecalculate = async () => {
    const data = await dbList.getByGroup(group.id);
    let incomes = 0;
    let expenses = 0;
    data.forEach((item) => {
      if (item.type === "income") incomes += item.value;
      else expenses += item.value;
    });
    db.updateExpenses(group.id, expenses);
    db.updateIncomes(group.id, incomes);
    reload();
  }

  if (!group || !group?.id) return (
    <>
      <WithoutRegister
        reload={reload}
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
                $ {group.incomes.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.detailsBlock, styles.goal]}>
              <Text style={styles.goal}>{t("finances-feature.goal")}</Text>
              <Text style={[styles.sideLabel, styles.goal]}>
                $ {group.goal.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.detailsBlock, styles.expense]}>
              <Text style={styles.expense}>{t("finances-feature.expenses")}</Text>
              <Text style={[styles.sideLabel, styles.expense]}>
                $ {group.expenses.toFixed(2)}
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
                $ {(group.incomes - group.expenses).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <AddRegister
              actualRegister={group}
              reload={reload}
              handleReload={handleReload}
            >
              <Feather name="edit" size={20} color="black" />
            </AddRegister>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRecalculate}
            >
              <Feather name="refresh-cw" size={20} color="black" />
            </TouchableOpacity>
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
