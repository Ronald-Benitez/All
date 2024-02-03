import { View, Text, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import db from "@/src/db/earningsTable";
import AddProfit from "./AddProfit";
import Confirm from "@/src/components/configs/Confirm";
import VerticalDateBlock from "../ui/VerticalDateBlock";
import { useAlerts } from "../ui/useAlerts";

const EarningsList = ({ setTotal, reload, setReload, filter }) => {
  const styles = useSelector((state) => state.styles.styles);
  const [earnings, setEarnings] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const { t } = useTranslation();
  const { Toast, showSuccessToast } = useAlerts();
  const group = useSelector((state) => state.group.group);

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
    if (!group) return;
    db.getByGroup(group.id).then((data) => {
      setEarnings(data);
      setTotal(data.reduce((acc, item) => acc + parseFloat(item.amount), 0));
    }).catch(() => setEarnings([]));

  }, [group, reload]);

  const handleDelete = async (item) => {
    await db.deleteItem(item.id);
    setReload(!reload)
    showSuccessToast(t("finances-feature.item-deleted"));
  };

  if (!group || group === "") return

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
      <Toast />
    </View>
  );
};

export default EarningsList;
