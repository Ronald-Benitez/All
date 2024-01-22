import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";

import useStyle from "@/src/zustand/useStyle";
import DatePicker from "@/src/components/configs/DatePicker.jsx";
import ListHandler from "../../db/listTables";
import GroupHandler from "../../db/groupTables";
import { useAlerts } from "../ui/useAlerts";

export default function AddRegisterList({
  group,
  actualRegister,
  handleReload,
  setRegister,
  savingsFlag,
  children,
  style
}) {
  const styles = useStyle((state) => state.style);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState(moment().format("YYYY/MM/DD"));
  const [seeModal, setSeeModal] = useState(false);
  const { t } = useTranslation();
  const { Toast, showSuccessToast, showErrorToast } = useAlerts();

  const db = new ListHandler(savingsFlag ? "savingsList" : "registerList");
  const dbGroup = new GroupHandler(savingsFlag ? "savingsGroup" : "registerGroup");

  useEffect(() => {
    if (actualRegister) {
      setName(actualRegister.name);
      setValue(actualRegister.value);
      setType(actualRegister.type);
      setDate(actualRegister.date);
    }
  }, [actualRegister]);

  const verifyFields = () => {
    if (name && value) return true;
    return false;
  };

  const handleReloadGroup = () => {
    db.getByGroup(group.id).then((data) => {
      let expenses = 0;
      let incomes = 0;
      data.forEach((item) => {
        if (item.type == "expense") {
          expenses += parseFloat(item.value);
        } else {
          incomes += parseFloat(item.value);
        }
      });
      dbGroup.updateExpenses(group.id, expenses);
      dbGroup.updateIncomes(group.id, incomes);
      dbGroup.getByYear(group.year).then((data) => {
        handleReload(data, group.id);
      });
    });
  };

  const handleSave = async () => {
    if (!verifyFields()) {
      showErrorToast(t("errors.empty-fields"));
      return;
    }
    if (actualRegister) {
      db.updateItem(actualRegister.id, name, date, value, type);
      db.getByGroup(group.id).then(() => {
        handleReloadGroup();
      });
      showSuccessToast(t("finances-feature.item-updated"));
    } else {
      db.insertItem(name, date, value, type, group.id);
      setName("");
      setValue("");
      setType("expense");

      if (type == "expense") {
        dbGroup.updateExpenses(group.id, group.expenses + parseFloat(value));
      } else {
        dbGroup.updateIncomes(group.id, group.incomes + parseFloat(value));
      }
      dbGroup.getItem(group.id).then((data) => {
        setRegister(data);
      });
      showSuccessToast(t("finances-feature.item-added"));
    }
    setSeeModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={style}
        onPress={() => setSeeModal(true)}
      >
        {children}
      </TouchableOpacity>
      <Modal visible={seeModal} transparent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSeeModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.container}>
              <Text style={styles.title}>
                {actualRegister ? t("finances-feature.edit-item") : t("finances-feature.add-item")}
              </Text>
              <View style={styles.row}>
                <Text style={styles.label}>{t("finances-feature.name")}</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setName(text)}
                  value={name}
                  placeholder={t("finances-feature.name")}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("finances-feature.value")}</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setValue(text)}
                  value={String(value)}
                  keyboardType="numeric"
                  placeholder={t("finances-feature.value")}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("finances-feature.type")}</Text>
                <TouchableOpacity
                  style={styles.input}
                  onPress={() => {
                    setType(type == "expense" ? "income" : "expense");
                  }}
                >
                  <Text style={styles.buttonText}>{t(`finances-feature.${type}`)}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.row}>
                <DatePicker value={date} onChange={setDate} />
              </View>
              <TouchableOpacity style={[styles.buttonBordered]} onPress={handleSave}>
                <Feather name="save" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      {Toast}
    </>
  );
}
