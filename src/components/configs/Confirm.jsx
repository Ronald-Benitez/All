import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function Confirm({
  onConfirm,
  message,
  title,
  children,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const styles = useSelector((state) => state.styles.styles);

  const handleConfirm = () => {
    setModalVisible(false);
    onConfirm();
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
      >
        {children}
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.modalText}>{message}</Text>
            <View style={[styles.row, { marginTop: 10 }]}>
              <TouchableOpacity
                style={styles.buttonBordered}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonSecondaryText}>{t("confirm.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleConfirm}
              >
                <Text style={styles.buttonPrimaryText}>{t("confirm.accept")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
