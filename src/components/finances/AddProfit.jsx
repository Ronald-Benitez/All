import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";

import useStyle from "@/src/zustand/useStyle";
import db from "@/src/db/earningsTable";
import DatePicker from "@/src/components/configs/DatePicker.jsx";

export default function AddEarning({
  groupId,
  reload,
  actualEarning,
  children,
  style
}) {
  const styles = useStyle((state) => state.style);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(moment().format("YYYY/MM/DD"));
  const [seeAdd, setSeeAdd] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (actualEarning) {
      setName(actualEarning.name);
      setAmount(actualEarning.amount.toString());
      setDate(actualEarning.date);
    }
  }, [actualEarning]);

  const verifyFields = () => {
    if (name && amount) return true;
    return false;
  };

  const handleSave = async () => {
    if (!verifyFields()) {
      Alert.alert("Error", t("errors.empty-fields"));
      return;
    }
    if (actualEarning) {
      await db.updateItem(
        actualEarning.id,
        date,
        name,
        amount,
        actualEarning.group_id
      );
      reload();
    } else {
      db.insertItem(date, name, amount, groupId);
      setName("");
      setAmount("");
      reload();
    }
    setSeeAdd(false);
  };

  return (
    <>
      <TouchableOpacity
        style={style}
        onPress={() => setSeeAdd(true)}
      >
        {children}
      </TouchableOpacity>
      <Modal visible={seeAdd} transparent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSeeAdd(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.container}>
              <Text style={styles.title}>
                {actualEarning ? t("finances-feature.edit-profit") : t("finances-feature.add-profit")}
              </Text>
              <View style={[styles.row]}>
                <DatePicker value={date} onChange={setDate} />
              </View>
              <View style={[styles.row]}>
                <Text style={[styles.label]}>{t("finances-feature.name")}</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholder={t("finances-feature.name")}
                />
              </View>
              <View style={[styles.row]}>
                <Text style={[styles.label]}>{t("finances-feature.value")}</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={(text) => setAmount(text)}
                  keyboardType="numeric"
                  placeholder={t("finances-feature.value")}
                />
              </View>
              <TouchableOpacity style={[styles.buttonBordered]} onPress={handleSave}>
                <Feather name="save" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
