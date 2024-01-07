import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import { Feather, AntDesign } from "@expo/vector-icons";

import db from "@/src/db/earningsTable";
import useStyle from "@/src/zustand/useStyle";
import AddProfit from "./AddProfit";
import Confirm from "@/src/components/configs/Confirm";

const EarningsList = ({ groupId, setTotal, reload, filter }) => {
  const [earnings, setEarnings] = useState([]);
  const styles = useStyle((state) => state.style);
  const [edit, setEdit] = useState(false);
  const [actualEarning, setActualEarning] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [filteredList, setFilteredList] = useState([]);


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

  const handleDelete = async () => {
    await db.deleteItem(actualEarning.id);
    reload()
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
          Profits, budget and finances use the same group by default, enter a
          profit to get started
        </Text>
        <AddProfit
          groupId={groupId}
          reload={reload}
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
        {
          minWidth: "90%",
        },
      ]}
    >
      <>
        <FlatList
          data={filteredList.length > 0 ? filteredList : earnings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={[styles.row]}>
              <AddProfit
                reload={reload}
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
                <View style={styles.row}>
                  {["DD", "MMM", "YYYY"].map((format, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.dateVerticalSmall, styles.income
                      ]}
                    >
                      {moment(item.date, "YYYY/MM/DD").format(format)}
                    </Text>
                  ))}
                </View>
                <Text style={[styles.text, styles.income]}>{item.name}</Text>
                <Text style={[styles.text, styles.income]}>
                  $ {item.amount}
                </Text>
              </AddProfit>
              <TouchableOpacity
                style={[
                  {
                    margin: 0,
                    padding: 0,
                    marginRight: 5,
                  },
                ]}
                onPress={() => {
                  setDeleteModal(true);
                  setActualEarning(item);
                }}
              >
                <Feather name="trash-2" size={20} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
        <Modal visible={edit} transparent>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setEdit(false)}
          >
            <View style={styles.modalContent}>
              <AddProfit
                reload={reload}
                actualEarning={actualEarning}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        <Confirm
          visible={deleteModal}
          setVisible={setDeleteModal}
          onConfirm={handleDelete}
          title="Delete Earning"
          message="Are you sure you want to delete this earning?"
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setDeleteModal(false)}
        />
      </>
    </View>
  );
};

export default EarningsList;
