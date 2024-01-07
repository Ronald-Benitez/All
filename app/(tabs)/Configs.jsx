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
import useStyle from "@/src/zustand/useStyle";

const Configs = () => {
  const [configs, setConfigs] = useState({});
  const [pet, setPet] = useState({});
  const [reload, setReload] = useState(false);
  const componentStyles = useStyle((state) => state.style);
  const [newData, setNewData] = useState({});
  const [colorModal, setColorModal] = useState(false);
  const [PickerData, setPickerData] = useState({});
  const [confirmData, setConfirmData] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const setStyle = useStyle((state) => state.setStyle);

  useEffect(() => {
    Promise.all([getStyles(), getConfigs(), getPet()]).then(
      ([data, configsData, petData]) => {
        setStyle(data);
        setConfigs(configsData);
        setPet(petData);
        console.log("configsData", petData);

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
          <TouchableOpacity
            style={[componentStyles.buttonPrimary, { padding: 10 }]}
            onPress={() => {
              setConfirmData({
                title: "Reset configs?",
                message:
                  "Are you sure you want to reset your configs to default?",
                confirmText: "Reset",
                cancelText: "Cancel",
                onConfirm: () => {
                  deleteConfigs();
                  setReload(!reload);
                },
              });
              setOpenConfirm(true);
            }}
          >

            <Text style={componentStyles.buttonPrimaryText}>
              Reset configs to default
            </Text>
          </TouchableOpacity>
        </View>
        {configs &&
          Object.keys(configs).map((key) => (
            <Dropdown
              key={"configs" + key}
              title={configs[key]?.name.value}
            >
              <View style={componentStyles.block}>
                {Object.keys(configs[key]).map((key2) => {
                  const configValue = configs[key][key2].value;
                  const configType = configs[key][key2].type;

                  return (
                    <View
                      key={key2}
                      style={[
                        componentStyles.row,
                        { justifyContent: "space-between" },
                      ]}
                    >
                      <Text style={componentStyles.sideLabel}>
                        {convertCamelCase(key2)}
                      </Text>
                      {configType === "color" ? (
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
                      ) : (
                        <TextInput
                          style={[componentStyles.input, { minWidth: 150 }]}
                          onChangeText={(value) =>
                            setNewData({
                              type: "config",
                              key,
                              key2,
                              value,
                            })
                          }
                          value={configValue}
                          placeholder={key2}
                        />
                      )}
                    </View>
                  );
                })}
                <View style={componentStyles.row}>
                  <TouchableOpacity
                    style={[componentStyles.buttonPrimary, { padding: 10 }]}
                    onPress={() => {
                      setConfirmData({
                        title: "Reset config?",
                        message:
                          "Are you sure you want to reset this config to default?",
                        confirmText: "Reset",
                        cancelText: "Cancel",
                        onConfirm: () => handleReset(key),
                      });
                      setOpenConfirm(true);
                    }}
                  >
                    <SimpleLineIcons name="refresh" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </Dropdown>
          ))}
        <View style={componentStyles.row}>
          <TouchableOpacity
            style={[componentStyles.buttonPrimary, { padding: 10 }]}
            onPress={() => {
              setConfirmData({
                title: "Reset pet?",
                message: "Are you sure you want to reset your pet?",
                confirmText: "Delete",
                cancelText: "Cancel",
                onConfirm: () => handleDelete(),
              });
              setOpenConfirm(true);
            }}
          >
            <Text style={componentStyles.buttonPrimaryText}>
              Reset pet to default
            </Text>
          </TouchableOpacity>
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
                <Text style={componentStyles.sideLabel}>Name</Text>
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
                (key) =>
                  key !== "main" && (
                    <PetMessages
                      key={key}
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
      </View>

      <Confirm
        title={confirmData.title}
        message={confirmData.message}
        confirmText={confirmData.confirmText}
        cancelText={confirmData.cancelText}
        visible={openConfirm}
        setVisible={setOpenConfirm}
        onConfirm={() => {
          confirmData.onConfirm();
          setOpenConfirm(false);
        }}
        onCancel={() => {
          setOpenConfirm(false);
        }}
      />
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
