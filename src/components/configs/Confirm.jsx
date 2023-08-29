import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

import useStyle from "@/src/zustand/useStyle";

export default function Confirm({
  onConfirm,
  onCancel,
  message,
  confirmText,
  cancelText,
  visible,
  setVisible,
  title,
}) {
  const styles = useStyle((state) => state.style);

  const handleConfirm = () => {
    setVisible(false);
    onConfirm();
  };

  const handleCancel = () => {
    setVisible(false);
    onCancel();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <TouchableOpacity
        style={styles.modalBackdrop}
        onPress={() => setVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.modalText}>{message}</Text>
          <View style={[styles.row, { marginTop: 10 }]}>
            <TouchableOpacity
              style={styles.buttonBordered}
              onPress={handleCancel}
            >
              <Text style={styles.buttonSecondaryText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonPrimary}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonPrimaryText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
