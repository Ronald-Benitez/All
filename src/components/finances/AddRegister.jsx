import { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, TextInput, Alert, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";

import TableHandler from "../../db/groupTables";
import MonthPicker from "../ui/MonthPicker";
import { useAlerts } from "../ui/useAlerts";
import { setGroup } from "@/app/slices/groupSlice";

export default function AddRegister({
  reload,
  actualRegister,
  children,
  baseYear,
}) {
  const styles = useSelector((state) => state.styles.styles);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [seeModal, setSeeModal] = useState(false);
  const [month, setMonth] = useState(moment().format("MM"));
  const [year, setYear] = useState(moment().format("YYYY"));
  const type = useSelector((state) => state.group.type);
  const db = new TableHandler(type.group || "registerGroup");
  const { t } = useTranslation();
  const { Toast, showSuccessToast, showErrorToast } = useAlerts();
  const dispatch = useDispatch();

  useEffect(() => {
    if (actualRegister) {
      setName(actualRegister.name);
      setGoal(actualRegister.goal.toString());
    }
  }, [actualRegister]);

  useEffect(() => {
    if (baseYear) {
      setYear(baseYear);
    }
  }, [baseYear]);

  const handleSave = async () => {
    if (!verifyFields()) {
      showErrorToast(t("errors.empty-fields"));
      return;
    }
    if (year.length !== 4) {
      showErrorToast(t("errors.invalid-year"));
      return;
    }
    if (actualRegister) {
      db.updateBaseData(actualRegister.id, name, goal);
      db.getByYear(actualRegister.year).then((data) => {
        dispatch(setGroup(data.find((item) => item.id == actualRegister.id)));
      });
      showSuccessToast(t("finances-feature.register-updated"));

    } else {
      db.insertItem(name, month, year, 0, 0, goal);
      setName("");
      setGoal("");
      showSuccessToast(t("finances-feature.register-added"));
      dispatch(setGroup(null));
      reload();
    }
    setSeeModal(false);
  };

  const verifyFields = () => {
    if (name && goal) return true;
    return false;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.button}
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
                {actualRegister ? t("finances-feature.edit-register") : t("finances-feature.add-register")}
              </Text>

              <View style={styles.row}>
                <MonthPicker month={month} onChange={setMonth} />
                <TextInput
                  style={[styles.input, { minWidth: 100, textAlign: "center" }]}
                  value={year}
                  onChangeText={setYear}
                  placeholder={t("const.year")}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("finances-feature.name")}</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setName(text)}
                  value={name}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>{t("finances-feature.goal")}</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setGoal(text)}
                  value={goal}
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity style={[styles.buttonBordered]} onPress={handleSave}>
                <Feather name="save" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Toast />
    </>
  );
}
