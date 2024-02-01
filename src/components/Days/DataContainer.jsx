import { useState, useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { useTranslation } from 'react-i18next'
import { useSelector } from "react-redux";

import db from "@/src/db/daysTable";

export default function DataContainer({
  day,
  color,
  edit,
  data,
  reload,
  setReload,
}) {
  const styles = useSelector((state) => state.styles.styles);
  const [expected, setExpected] = useState("");
  const [real, setReal] = useState("");
  const { t } = useTranslation()

  const handleExpectedChange = (value) => {
    setExpected(value);
    db.updateExpected(day, value);
    setReload && setReload(!reload);
  };
  const handleRealChange = (value) => {
    setReal(value);
    db.updateReal(day, value);
    setReload && setReload(!reload);
  };

  useEffect(() => {
    if (data) {
      setExpected(data.expected);
      setReal(data.real);
    }
  }, [data]);

  const editView = () => {
    return (
      <View
        style={[
          styles.container,
          {
            minHeight: 500,
          },
        ]}
      >
        <Text style={[styles.dayDetailsTitle, color]}>{t("days-feature.expected")}</Text>
        <TextInput
          style={[
            styles.input,
            color,
            {
              minHeight: 150,
              width: "90%",
            },
          ]}
          onChangeText={handleExpectedChange}
          value={expected}
          multiline={true}
          placeholder={t("days-feature.expected")}
        />
        <Text style={[styles.dayDetailsTitle, color]}>{t("days-feature.real")}</Text>
        <TextInput
          style={[
            styles.input,
            color,
            {
              minHeight: 150,
              width: "90%",
            },
          ]}
          onChangeText={handleRealChange}
          value={real}
          multiline={true}
          placeholder={t("days-feature.real")}
        />
      </View>
    );
  };

  const view = () => {
    return (
      <View style={[styles.container]}>
        <Text style={[styles.dayDetailsTitle, color]}>{t("days-feature.expected")}</Text>
        <View
          style={[
            styles.dayDetailsBlock,
            color,
            {
              padding: 10,
            },
          ]}
        >
          <Text style={[styles.dayDetailsText, color]}>{expected}</Text>
        </View>

        <Text style={[styles.dayDetailsTitle, color]}>{t("days-feature.real")}</Text>
        <View
          style={[
            styles.dayDetailsBlock,
            color,
            {
              padding: 10,
            },
          ]}
        >
          <Text style={[styles.dayDetailsText, color]}>{real}</Text>
        </View>
      </View>
    );
  };

  return edit ? editView() : view();
}
