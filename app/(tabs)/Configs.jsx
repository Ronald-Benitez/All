import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { SimpleLineIcons } from "@expo/vector-icons";

import {
  getConfigs,
  setConfigs as fileSet,
  deleteConfigs,
  resetConfigs,
} from "../../src/helpers/files";
import getStyles from "../../src/styles/styles";
import ColorPicker from "../../src/components/configs/ColorPicker";
import { convertCamelCase } from "../../src/helpers/stringsHelper";
import baseConfigs from "../../src/files/configs";

const Configs = () => {
  const [configs, setConfigs] = useState({});
  const [reload, setReload] = useState(false);
  const [componentStyles, setComponentStyles] = useState({});
  const [newColor, setNewColor] = useState({});

  useEffect(() => {
    getStyles().then((data) => {
      setComponentStyles(data);
    });
    getConfigs().then((configs) => {
      setConfigs(configs);
    });
    // deleteConfigs();
  }, [reload]);

  const handleLocalConfig = async (key, key2, value) => {
    const newConfig = { ...configs };
    newConfig[key][key2].value = value;
    setConfigs(newConfig);
    fileSet(configs);
    setReload(!reload);
  };

  const handleReset = async (key) => {
    resetConfigs(key).then(() => {
      setReload(!reload);
    });
  };

  const handleDelete = async (key) => {
    deleteConfigs().then(() => {
      setReload(!reload);
    });
  };

  useEffect(() => {
    if (Object.keys(newColor).length > 0) {
      handleLocalConfig(newColor.key, newColor.key2, newColor.value);
    }
  }, [newColor]);

  return (
    <ScrollView>
      <View style={componentStyles.container}>
        <View style={componentStyles.row}>
          <TouchableOpacity
            style={[componentStyles.buttonPrimary, { padding: 10 }]}
            onPress={() => handleDelete()}
          >
            <Text style={componentStyles.buttonPrimaryText}>
              Reset to default
            </Text>
          </TouchableOpacity>
        </View>
        {Object.keys(configs).map((key) => (
          <View key={key} style={componentStyles.block}>
            <Text style={componentStyles.title}>{configs[key].name.value}</Text>
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
                    <ColorPicker
                      base={configValue}
                      setNewElement={setNewColor.bind(this)}
                      newElement={{ key, key2, value: configValue }}
                    />
                  ) : (
                    <TextInput
                      style={[componentStyles.input, { minWidth: 150 }]}
                      onChangeText={(value) =>
                        handleLocalConfig(key, key2, value)
                      }
                      value={String(configValue)}
                      placeholder={key2}
                    />
                  )}
                </View>
              );
            })}
            <View style={componentStyles.row}>
              <TouchableOpacity
                style={[componentStyles.buttonPrimary, { padding: 10 }]}
                onPress={() => handleReset(key)}
              >
                <SimpleLineIcons name="refresh" size={18} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Configs;
