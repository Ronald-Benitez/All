import { View, Text, TouchableOpacity, TextInput, Alert, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import useStyle from "@/src/zustand/useStyle";
import db from "@/src/db/budgetsTable";
import { useAlerts } from "../ui/useAlerts";

const AddBudget = ({ reload, setReload, groupId, data, children, style }) => {
  const styles = useStyle((state) => state.style);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [seeAdd, setSeeAdd] = useState(false);
  const { t } = useTranslation();
  const { Toast, showSuccessToast, showErrorToast } = useAlerts();

  useEffect(() => {
    if (data) {
      setName(data.name);
      setValue(data.value);
      setQuantity(data.quantity);
    }
  }, [data]);

  const handleSave = async () => {
    if (name !== "" && value !== "" && quantity !== "") {
      if (data) {
        await db.updateItem(
          data.id,
          name,
          value * quantity,
          quantity,
          value,
          groupId
        );
        setReload(!reload);
        showSuccessToast(t("finances-feature.item-updated"));
      } else {
        await db.insertItem(name, value * quantity, quantity, value, groupId);
        setReload(!reload);
        showSuccessToast(t("finances-feature.item-added"));
      }
      clearInputs();
      setSeeAdd(false)
    } else {
      showErrorToast(t("errors.empty-fields"));
    }
  };

  const clearInputs = () => {
    setName("");
    setValue("");
    setQuantity("");
  };

  const renderBtn = () => {
    if (data) {
      return (
        <>
          <TouchableOpacity
            style={[styles.buttonBordered]}
            onPress={() => {
              handleSave();
              setSeeAdd(false)
            }}
          >
            <Feather name="check" size={15} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonBordered}
            onPress={() => {
              setSeeAdd(false)
            }}
          >
            <Feather name="x" size={15} color="black" />
          </TouchableOpacity>
        </>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.buttonBordered}
          onPress={() => {
            handleSave();
          }}
        >
          <AntDesign name="plus" size={15} color="black" />
        </TouchableOpacity>
      );
    }
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
            <Text style={styles.title}>
              {data ? t("finances-feature.edit-budget") : t("finances-feature.add-budget")}
            </Text>
            <View style={styles.block}>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.sideLabel}>{t("finances-feature.name")}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={t("finances-feature.name")}
                    onChangeText={(text) => setName(text)}
                    multiline={true}
                    value={name}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.sideLabel}>{t("finances-feature.value")}</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { minWidth: 120 },
                    ]}
                    value={String(value)}
                    placeholder={t("finances-feature.value")}
                    onChangeText={(text) => setValue(text)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.column}>
                  <Text style={styles.sideLabel}>{t("finances-feature.quantity")}</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { minWidth: 120 },
                    ]}
                    value={String(quantity)}
                    placeholder={t("finances-feature.quantity")}
                    onChangeText={(text) => setQuantity(text)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.column}>
                  <Text style={styles.sideLabel}>{t("finances-feature.total")}</Text>
                  <Text
                    style={styles.input}
                  >
                    ${(value * quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>{renderBtn()}</View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      {Toast}
    </>
  );
};

export default AddBudget;
