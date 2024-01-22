import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useStyle from "@/src/zustand/useStyle";

export const useAlerts = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const styles = useStyle((state) => state.style);

  const showModal = (content) => {
    setModalContent(content);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalContent(null);
    setModalVisible(false);
  };

  const showCustomToast = (message, iconName = 'alarm-on', options = {}) => {
    const iconSize = options.iconSize || 24;
    const iconColor = options.iconColor || 'black';
    const content = (
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    );

    showModal(content);

    const duration = options.duration || 2000;
    setTimeout(() => {
      hideModal();
    }, duration);
  };

  const showSuccessToast = (message, options = {}) => {
    showCustomToast(message, 'check-circle-outline', {
      ...options,
      iconColor: 'green',
    });
  };

  const showErrorToast = (message, options = {}) => {
    showCustomToast(message, 'error-outline', {
      ...options,
      iconColor: 'red',
    });
  };

  const showWarningToast = (message, options = {}) => {
    showCustomToast(message, 'warning-amber', {
      ...options,
      iconColor: 'orange',
    });
  };

  const Toast = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => hideModal()}
    >
      <TouchableOpacity
        style={styles.bgToast}
        onPress={() => hideModal()}
      >
        <View style={styles.toast}>
          {modalContent}
        </View>
      </TouchableOpacity>
    </Modal>
  )

  return {
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    Toast
  }
};
