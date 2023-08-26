import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { useEffect, useState } from "react";
import moment from "moment/moment";
import { Feather } from "@expo/vector-icons";

import db from "@/src/db/earningsTable";
import getStyles from "@/src/styles/styles";
import AddEarning from "./AddEarning";
import Confirm from "@/src/components/configs/Confirm";

const EarningsList = ({ groupId, setTotal, setReload, reload }) => {
  const [earnings, setEarnings] = useState([]);
  const [styles, setStyles] = useState({});
  const [edit, setEdit] = useState(false);
  const [actualEarning, setActualEarning] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  useEffect(() => {
    db.getByGroup(groupId).then((data) => {
      setEarnings(data);
      setTotal(data.reduce((acc, item) => acc + parseFloat(item.amount), 0));
    });
  }, [groupId, reload]);

  const handleDelete = async () => {
    await db.deleteItem(actualEarning.id);
    setReload(!reload);
  };

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
          data={earnings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View key={item.id} style={[styles.row]}>
              <TouchableOpacity
                style={[
                  styles.registerBlock,
                  styles.income,
                  {
                    width: "80%",
                    margin: 5,
                  },
                ]}
                onPress={() => {
                  setEdit(true);
                  setActualEarning(item);
                }}
              >
                <View style={styles.row}>
                  <Text style={[styles.dateVerticalSmall, styles.income]}>
                    {moment(item.date, "YYYY/MM/DD").format("DD")}
                  </Text>
                  <Text style={[styles.dateVerticalSmall, styles.income]}>
                    {moment(item.date, "YYYY/MM/DD").format("MMM")}
                  </Text>
                  <Text style={[styles.dateVerticalSmall, styles.income]}>
                    {moment(item.date, "YYYY/MM/DD").format("YYYY")}
                  </Text>
                </View>
                <Text style={[styles.text, styles.income]}>{item.name}</Text>
                <Text style={[styles.text, styles.income]}>
                  $ {item.amount}
                </Text>
              </TouchableOpacity>
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
              <AddEarning
                setReload={setReload}
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
