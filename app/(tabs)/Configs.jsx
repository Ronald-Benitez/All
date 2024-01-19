import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import {
  getConfigs,
  setConfigs as fileSet,
  resetConfigs,
  deleteConfigs,
  getPet,
  deletePet,
  updatePet,
} from "../../src/helpers/files";
import getStyles from "../../src/styles/styles";
import { convertCamelCase } from "../../src/helpers/stringsHelper";
import Dropdown from "@/src/components/configs/Dropdown";
import Confirm from "@/src/components/configs/Confirm";
import PetMessages from "@/src/components/pet/PetMessages";
import ColorPicker from "../../src/components/configs/ColorPicker";
import LanguageHandler from "@/src/components/configs/LanguagesHandler";
import useStyle from "@/src/zustand/useStyle";
import { useTranslation } from 'react-i18next'

const Configs = () => {
  const [configs, setConfigs] = useState({});
  const [pet, setPet] = useState({});
  const [reload, setReload] = useState(false);
  const componentStyles = useStyle((state) => state.style);
  const [newData, setNewData] = useState({});
  const [colorModal, setColorModal] = useState(false);
  const [PickerData, setPickerData] = useState({});
  const setStyle = useStyle((state) => state.setStyle);
  const { t } = useTranslation()

  useEffect(() => {
    Promise.all([getStyles(), getConfigs(), getPet()]).then(
      ([data, configsData, petData]) => {
        setStyle(data);
        setConfigs(configsData);
        setPet(petData);
      }
    );
    // deleteConfigs();
  }, [reload]);

  const handleLocalConfig = async (key, key2, value) => {
    const newConfig = { ...configs };
    newConfig[key][key2].value = value;

    setConfigs(newConfig);
    await fileSet(newConfig);
    setNewData({});
    setReload(!reload);
  };

  const handlePetUpdate = (key, value) => {
    const newPet = { ...pet };
    newPet[key] = value;
    setPet(newPet);
    updatePet(newPet);
    setNewData({});
  };

  const handleReset = async (key) => {
    await resetConfigs(key);
    setReload(!reload);
  };

  const handleDelete = async () => {
    await deletePet();
    setReload(!reload);
  };

  useEffect(() => {
    if (Object.keys(newData).length > 0) {
      if (newData.type === "pet") {
        handlePetUpdate(newData.key, newData.value);
      } else {
        handleLocalConfig(newData.key, newData.key2, newData.value);
      }
    }
  }, [newData]);

  return (
    <ScrollView>
      <View style={componentStyles.container}>
        <View style={componentStyles.row}>
          <Confirm
            title={t("configs.reset-title")}
            message={t("configs.reset-msg")}
            onConfirm={deleteConfigs}
          >
            <Text style={[componentStyles.buttonPrimary, componentStyles.buttonPrimaryText]}>
              {t("configs.reset-btn")}
            </Text>
          </Confirm>
        </View>
        {configs &&
          Object.keys(configs).map((key) => (
            <Dropdown
              key={"configs" + key}
              title={t("configs." + key) || convertCamelCase(key)}
            >
              <View style={[componentStyles.block, { minWidth: "100%" }]}>
                {Object.keys(configs[key]).map((key2) => {
                  const configValue = configs[key][key2].value;
                  const configType = configs[key][key2].type;
                  if (configType !== "color") return null
                  return (
                    <View
                      key={key2}
                      style={[
                        componentStyles.row,
                        { justifyContent: "space-between", minHeight: 40 },
                      ]}
                    >
                      <Text style={componentStyles.sideLabel}>
                        {t("configs." + key2) || convertCamelCase(key2)}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setColorModal(true);
                          setPickerData({ key, key2, value: configValue });
                        }}
                      >
                        <View
                          style={[
                            componentStyles.colorPreview,
                            { backgroundColor: configValue },
                          ]}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <View style={componentStyles.row}>
                  <Confirm
                    title={t("configs.reset-one-title")}
                    message={t("configs.reset-one-msg")}
                    onConfirm={() => handleReset(key)}
                  >
                    <View
                      style={[componentStyles.buttonPrimary, { padding: 10 }]}
                    >
                      <SimpleLineIcons name="refresh" size={18} color="white" />
                    </View>
                  </Confirm>
                </View>
              </View>
            </Dropdown>
          ))}
        <View style={componentStyles.row}>
          <Confirm
            title={t("configs.reset-p-title")}
            message={t("configs.reset-p-msg")}
            onConfirm={handleDelete}
          >
            <Text style={[componentStyles.buttonPrimary, componentStyles.buttonPrimaryText]}>
              {t("configs.reset-p-btn")}
            </Text>
          </Confirm>
        </View>
        {pet && (
          <Dropdown
            key="pet"
            title={pet.main?.name || "Pet"}
          >
            <View style={componentStyles.block}>
              <View
                style={[
                  componentStyles.row,
                  { justifyContent: "space-between" },
                ]}
              >
                <Text style={componentStyles.sideLabel}>{t("configs.name")}</Text>
                <TextInput
                  style={[componentStyles.input, { minWidth: 150 }]}
                  onChangeText={(value) =>
                    setNewData({
                      type: "pet",
                      key: "main",
                      value: { ...pet.main, name: value },
                    })
                  }
                  value={pet.main?.name}
                  placeholder="Name"
                />
              </View>
              {Object.keys(pet).map(
                (key, index) =>
                  key !== "main" && (
                    <PetMessages
                      key={index}
                      data={pet[key]}
                      onChange={(value) =>
                        setNewData({
                          type: "pet",
                          key,
                          value,
                        })
                      }
                    />
                  )
              )}
            </View>
          </Dropdown>
        )}
        <Dropdown
          key="language"
          title={t("language.label")}
        >
          <LanguageHandler />
        </Dropdown>
      </View>

      <ColorPicker
        newElement={PickerData}
        styles={componentStyles}
        visible={colorModal}
        setVisible={setColorModal}
        onColorChange={(value) =>
          handleLocalConfig(PickerData.key, PickerData.key2, value)
        }
      />
    </ScrollView>
  );
};

export default Configs;
