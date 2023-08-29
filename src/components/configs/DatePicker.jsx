import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import Date from "react-native-modern-datepicker";
import moment from "moment/moment";

import useStyle from "@/src/zustand/useStyle";

export default function DatePicker({ value, onChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value);
  const styles = useStyle((state) => state.style);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onChange(date);
  };

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[styles.button, styles.row]}
      >
        <Text style={styles.datePreview}>{
          moment(selectedDate,"YYYY/MM/DD").format("dddd, MMMM Do YYYY")
        }</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Date
              mode="calendar"
              options={styles.datePickerOptions}
              onSelectedChange={handleDateSelect}
              selected={selectedDate}
              style={styles.datePickerStyle}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
