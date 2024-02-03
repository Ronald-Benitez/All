import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { useEffect, useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import db from "@/src/db/budgetsTable";
import AddBudget from "./AddBudget";
import Confirm from "@/src/components/configs/Confirm";
import { useAlerts } from "../ui/useAlerts";

const BudgetsList = ({ setTotal, setReload, reload, filter }) => {
  const styles = useSelector((state) => state.styles.styles);
  const [budgets, setBudgets] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const { t } = useTranslation();
  const { Toast, showSuccessToast } = useAlerts();
  const group = useSelector((state) => state.group.group);

  useEffect(() => {
    if (!filter || filter.length <= 0) {
      setFilteredList([]);
      return setTotal(
        budgets.reduce((acc, item) => acc + parseFloat(item.amount), 0)
      );
    }
    const newFilteredList = budgets.filter((item) => filter.some((f) => item.name.toLowerCase().includes(f)));
    setFilteredList(newFilteredList);
    setTotal(
      newFilteredList.reduce((acc, item) => acc + parseFloat(item.amount), 0)
    );
  }, [filter, budgets]);

  useEffect(() => {
    if (!group) return;
    db.getByGroup(group.id).then((data) => {
      setBudgets(data);
      setTotal(data.reduce((acc, item) => acc + parseFloat(item.amount), 0));
    }).catch((err) => {
      console.log(err)
    });
  }, [group, reload]);

  const handleDelete = async (item) => {
    await db.deleteItem(item.id);
    showSuccessToast(t("finances-feature.item-deleted"));
    setReload(!reload);
  };

  if (!group || group === "") return

  if (budgets.length <= 0) return (
    <>
      <View
        style={[
          styles.block,
          { padding: 0, minWidth: "90%", },
        ]}
      >
        <Text style={[styles.sideLabel, { padding: 10 }]}>
          {t("finances-feature.no-item-b")}
        </Text>
        <AddBudget
          setReload={setReload}
          reload={reload}
          style={styles.button}
        >
          <AntDesign name="addfile" size={20} color="black" />
        </AddBudget>
      </View>
    </>
  )

  return (
    <View
      style={[
        styles.block,
        { minWidth: "99%", padding: 7, },
      ]}
    >
      <View
        style={[
          styles.row,
          { height: 30, },
        ]}
      >
        <View style={[styles.column, { flex: 2 }]}>
          <Text style={[styles.sideLabel]}>{t("finances-feature.name")}</Text>
        </View>
        <View style={[styles.column, { flex: 1 }]}>
          <Text style={[styles.sideLabel]}>$</Text>
        </View>
        <View style={[styles.column, { flex: 1 }]}>
          <Text style={[styles.sideLabel]}>#</Text>
        </View>
        <View style={[styles.column, { flex: 1 }]}>
          <Text style={[styles.sideLabel]}>{t("finances-feature.total")}</Text>
        </View>
        <View style={[styles.column, { flex: 1 }]}>
          <Text style={[styles.sideLabel]}></Text>
        </View>
      </View>
      <FlatList
        data={filteredList.length > 0 ? filteredList : budgets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View key={item.id} style={[styles.row]}>
            <AddBudget
              setReload={setReload}
              reload={reload}
              data={item}
              style={[
                styles.row,
                styles.primaryBorder,
                { width: "85%", minHeight: 30, },
              ]}
            >
              <View style={[styles.row, { minHeight: 45 }]}>
                <View style={[styles.column, { flex: 2 }]}>
                  <Text style={[styles.text]}>{item.name}</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                  <Text style={[styles.text]}>$ {item.value}</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                  <Text style={[styles.text]}>{item.quantity}</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                  <Text style={[styles.text]}>$ {item.amount}</Text>
                </View>
              </View>
            </AddBudget>
            <View style={[styles.column, { flex: 1 }]}>
              <Confirm
                onConfirm={() => handleDelete(item)}
                title={t("finances-feature.d-i-title")}
                message={t("finances-feature.d-i-msg")}
              >
                <View
                  style={[
                    styles.buttonBordered,
                    {
                      width: "100%",
                      padding: 6,
                      alignItems: "center",
                    },
                  ]}
                >
                  <Feather name="trash-2" size={15} color="black" />
                </View>
              </Confirm>
            </View>
          </View>
        )}
      />
      <Toast />
    </View>
  );
};

export default BudgetsList;
