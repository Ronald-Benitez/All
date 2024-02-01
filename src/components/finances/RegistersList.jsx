import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, FlatList, ScrollView } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import Confirm from "@/src/components/configs/Confirm";
import AddRegisterList from "./AddRegisterList";
import ListHandler from "../../db/listTables";
import GroupHandler from "../../db/groupTables";
import VerticalDateBlock from "../ui/VerticalDateBlock";
import { useAlerts } from "../ui/useAlerts";
import { setGroup } from "@/app/slices/groupSlice";

export default function RegistersListCard({
  isDown,
  setIsDown,
  filter,
}) {
  const styles = useSelector((state) => state.styles.styles);
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [total, setTotal] = useState(0);
  const { t } = useTranslation();
  const type = useSelector((state) => state.group.type);
  const group = useSelector((state) => state.group.group);
  const db = new ListHandler(type.list || "registerList");
  const dbGroup = new GroupHandler(type.group || "registerGroup");
  const { Toast, showSuccessToast } = useAlerts();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!filter || filter.length <= 0) {
      setFilteredList([]);
      return;
    }
    const newFilteredList = list.filter((item) =>
      filter.some((f) => item.name.toLowerCase().includes(f))
    );
    setFilteredList(newFilteredList);
  }, [filter, list]);

  useEffect(() => {
    if (filteredList.length > 0) {
      handleSum(filteredList);
    }
  }, [filteredList]);

  useEffect(() => {
    if (!group?.id) {
      setList([]);
      return;
    }

    db.getByGroup(group.id)
      .then((data) => setList(data || []))
      .catch(() => setList([]));
  }, [group]);


  const handleSum = (newList) => {
    setTotal(
      newList.reduce((acc, item) => {
        return acc + (item.type === "income" ? parseFloat(item.value) : -parseFloat(item.value));
      }, 0)
    );
  };

  const handleDelete = async (item) => {
    db.deleteItem(item.id);

    const newGroup = { ...group };

    if (item.type === "income") {
      newGroup.incomes -= item.value;
      dbGroup.updateIncomes(newGroup.id, newGroup.incomes);
    } else if (item.type === "expense") {
      newGroup.expenses -= item.value;
      dbGroup.updateExpenses(newGroup.id, newGroup.expenses);
    }

    dbGroup.getItem(group.id)
      .then((data) => {
        dispatch(setGroup(data))
        showSuccessToast(t("finances-feature.item-deleted"));
      });
  };

  if (!group) return
  if (list.length <= 0) return (
    <>
      <View
        style={[
          styles.block,
          {
            padding: 0,
          },
        ]}
      >
        <Text style={[styles.sideLabel, { padding: 10 }]}>
          {t("finances-feature.no-items-msg")}
        </Text>
        <AddRegisterList
          group={group}
          setRegister={setGroup}
          style={styles.button}
        >
          <AntDesign name="addfile" size={20} color="black" />
        </AddRegisterList>
      </View>
    </>
  );

  const data = filteredList.length > 0 ? filteredList : list;

  return (
    <View
      style={[
        styles.block,
        {
          padding: 0,
          width: "95%",
        },
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: "95%",
            },
            styles.row,
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
      {filteredList.length > 0 && (
        <View style={styles.row}>
          <Text style={styles.sideLabel}>{t("finances-feature.filtered")}:</Text>
          <Text style={styles.sideLabel}>{total}</Text>
        </View>
      )}
      {isDown && (
        <ScrollView>
          {data.map((item) => (
            <View key={item.id} style={[styles.row]}>
              <AddRegisterList
                actualRegister={item}
                style={[
                  styles.registerBlock,
                  item.type === "income" ? styles.income : styles.expense,
                  {
                    width: "80%",
                    margin: 5,
                  },
                ]}
              >
                <VerticalDateBlock date={item.date} type={item.type} />

                <Text
                  style={
                    item.type === "income" ? styles.income : styles.expense
                  }
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.sideLabel,
                    item.type === "income" ? styles.income : styles.expense,
                  ]}
                >
                  $ {item.value}
                </Text>
              </AddRegisterList>
              <Confirm
                title={t("finances-feature.d-i-title")}
                message={t("finances-feature.d-i-msg")}
                onConfirm={() => handleDelete(item)}
              >
                <View
                  style={[
                    {
                      padding: 10,
                      margin: 0,
                    },
                  ]}
                >
                  <Feather name="trash-2" size={20} color="black" />
                </View>
              </Confirm>
            </View>
          ))}
        </ScrollView>
      )}
      <Toast />
    </View>
  );
}
