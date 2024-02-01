import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function PetMessages({ key = "nokey", data, onChange }) {
  const [see, setSee] = useState(false);
  const [petData, setPetData] = useState({});
  const { t } = useTranslation();
  const styles = useSelector((state) => state.styles.styles);

  useEffect(() => {
    setPetData(data);
  }, [data]);

  const editMessageHandler = (key, value) => {
    const newPetData = { ...petData };
    newPetData.message[key] = value;
    setPetData(newPetData);
  };

  const deleteMessageHandler = (key2) => {
    if (petData.message.length === 1) {
      Alert.alert("Error", t("pet.error-last"));
      return;
    }

    setPetData((prevState) => {
      return {
        ...prevState,
        message: prevState.message.filter((item, key) => key !== key2),
      };
    });
  };

  const addMessageHandler = () => {
    setPetData((prevState) => {
      return {
        ...prevState,
        message: [...prevState.message, ""],
      };
    });
  };

  const confirmChangesHandler = () => {
    setSee(false);
    onChange(petData);
  };

  return (
    <View
      style={[
        styles.row,
        {
          justifyContent: "space-between",
        },
      ]}
      key={key}
    >
      <Text style={styles.sideLabel}>{petData.name || ""}</Text>
      <TouchableOpacity
        style={[styles.buttonBordered]}
        onPress={() => setSee(true)}
      >
        <AntDesign name="eyeo" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={see}
        onRequestClose={() => setSee(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setSee(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                width: "90%",
              },
            ]}
          >
            <Text style={styles.title}>{petData.name || ""}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {petData.message &&
                petData.message.map((message, key) => (
                  <View
                    style={[
                      styles.row,
                      {
                        justifyContent: "space-between",
                        padding: 10,
                      },
                    ]}
                    key={key}
                  >
                    <TextInput
                      style={[styles.input, { width: "85%", margin: 0 }]}
                      value={message}
                      onChangeText={(text) => editMessageHandler(key, text)}
                    />

                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          width: "auto",
                          padding: 0,
                          margin: 0,
                          marginLeft: 10,
                        },
                      ]}
                      onPress={() => deleteMessageHandler(key)}
                    >
                      <Feather name="trash" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.buttonPrimary, { marginRight: 10 }]}
                onPress={() => setSee(false)}
              >
                <Text style={styles.buttonPrimaryText}>{t("pet.cancel")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button]}
                onPress={() => addMessageHandler()}
              >
                <Feather name="plus" size={24} color="black" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonPrimary, { marginLeft: 10 }]}
                onPress={() => confirmChangesHandler()}
              >
                <Text style={styles.buttonPrimaryText}>{t("pet.confirm")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
