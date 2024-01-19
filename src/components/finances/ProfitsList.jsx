import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import db from "@/src/db/earningsTable";
import useStyle from "@/src/zustand/useStyle";
import AddProfit from "./AddProfit";
import Confirm from "@/src/components/configs/Confirm";
import VerticalDateBlock from "../ui/VerticalDateBlock";

const EarningsList = ({ groupId, setTotal, reload, setReload, filter }) => {
  const [earnings, setEarnings] = useState([]);
  const styles = useStyle((state) => state.style);
  const [filteredList, setFilteredList] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!filter || filter.length <= 0) {
      setFilteredList([]);
      return setTotal(
        earnings.reduce((acc, item) => acc + parseFloat(item.amount), 0)
      );
    }
    const newFilteredList = earnings.filter((item) => filter.some((f) => item.name.toLowerCase().includes(f)));
    setFilteredList(newFilteredList);
    setTotal(
      newFilteredList.reduce((acc, item) => acc + parseFloat(item.amount), 0)
    );
  }, [filter, earnings]);

  useEffect(() => {
    db.getByGroup(groupId).then((data) => {
      setEarnings(data);
      setTotal(data.reduce((acc, item) => acc + parseFloat(item.amount), 0));
    });
  }, [groupId, reload]);

  const handleDelete = async (item) => {
    await db.deleteItem(item.id);
    setReload(!reload)
  };

  if (!groupId || groupId === "") return

  if (earnings.length <= 0) return (
    <>
      <View
        style={[styles.block,
        {
          minWidth: "90%",
        },]}
      >
        <Text style={[styles.sideLabel, { padding: 10 }]}>
          {t("finances-feature.no-item-p")}
        </Text>
        <AddProfit
          groupId={groupId}
          reload={() => setReload(!reload)}
          style={styles.button}
        >
          <AntDesign name="addfile" size={20} color="black" />
        </AddProfit>
      </View>
    </>
  )

  return (
    <View
      style={[
        styles.block,
        { minWidth: "90%" },
      ]}
    >
      <>
        <FlatList
          data={filteredList.length > 0 ? filteredList : earnings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={[styles.row]}>
              <AddProfit
                reload={() => setReload(!reload)}
                style={[
                  styles.registerBlock,
                  styles.income,
                  {
                    width: "80%",
                    margin: 5,
                  },
                ]}
                actualEarning={item}
              >
                <VerticalDateBlock date={item.date} type="income" />
                <Text style={[styles.text, styles.income]}>{item.name}</Text>
                <Text style={[styles.text, styles.income]}>
                  $ {item.amount}
                </Text>
              </AddProfit>
              <Confirm
                onConfirm={() => handleDelete(item)}
                title={t("finances-feature.d-i-title")}
                message={t("finances-feature.d-i-msg")}
              >
                <View
                  style={[
                    styles.button,
                  ]}
                >
                  <Feather name="trash-2" size={20} color="black" />
                </View>
              </Confirm>
            </View>
          )}
        />
      </>
    </View>
  );
};

export default EarningsList;
