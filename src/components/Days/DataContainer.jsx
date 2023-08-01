import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

import db from "@/src/db/daysTable";
import getStyles from "@/src/styles/styles";

export default function DataContainer({
  day,
  color,
  edit,
  data,
  reload,
  setReload,
}) {
  const [expected, setExpected] = useState("");
  const [real, setReal] = useState("");
  const [styles, setStyles] = useState({});

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
    getStyles().then((data) => {
      setStyles(data);
    });
  }, []);

  useEffect(() => {
    if (data) {
      setExpected(data.expected);
      setReal(data.real);
    }
  }, [data]);

  const editView = () => {
    return (
      <View style={[styles.container]}>
        <Text style={[styles.dayDetailsTitle, color]}>Expected</Text>
        <TextInput
          style={[styles.input, color]}
          onChangeText={handleExpectedChange}
          value={expected}
        />
        <Text style={[styles.dayDetailsTitle, color]}>Real</Text>
        <TextInput
          style={[styles.input, color]}
          onChangeText={handleRealChange}
          value={real}
        />
      </View>
    );
  };

  const view = () => {
    return (
      <View style={[styles.container]}>
        <Text style={[styles.dayDetailsTitle, color]}>Expected</Text>
        <View style={[styles.dayDetailsBlock, color]}>
          <Text style={[styles.dayDetailsText, color]}>{expected}</Text>
        </View>

        <Text style={[styles.dayDetailsTitle, color]}>Real</Text>
        <View style={[styles.dayDetailsBlock, color]}>
          <Text style={[styles.dayDetailsText, color]}>{real}</Text>
        </View>
      </View>
    );
  };

  return edit ? editView() : view();
}
