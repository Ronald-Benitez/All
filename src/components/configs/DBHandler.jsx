import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native'
import React from 'react'
import * as FileSystem from "expo-file-system";
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { exportDB, importDB } from "@/src/db/handleTables"
import useStyle from "@/src/zustand/useStyle";
import { useAlerts } from "../ui/useAlerts";
import Confirm from "@/src/components/configs/Confirm";


const DBHandler = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(''); // ['export', 'import']
    const [fileName, setFileName] = useState("ecoData");
    const [file, setFile] = useState(null);
    const styles = useStyle(state => state.style)

    const { t } = useTranslation()
    const { Toast, showSuccessToast, showErrorToast } = useAlerts();

    const exportToJson = async () => {
        const jsonData = await exportDB()
        try {
            const jsonContent = JSON.stringify(jsonData, null, 2);

            const fileUri = FileSystem.cacheDirectory + fileName + ".json";
            await FileSystem.writeAsStringAsync(fileUri, jsonContent, { encoding: FileSystem.EncodingType.UTF8 });

            Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: t("db.save") });
            setModalVisible(false);
        } catch (error) {
            showErrorToast(t("db.export-error"))
        }
    };

    const importFromJson = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
            const fileUri = result.assets[0].uri;
            if (fileUri === undefined) return;
            const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
            const jsonData = JSON.parse(fileContent);
            setFile(jsonData);
        } catch (error) {
            showErrorToast(t("db.import-error"))
        }
    };

    const handleModal = (type) => {
        setModalType(type);
        setModalVisible(!modalVisible);
    }

    const handleImport = async (keep) => {
        await importDB(file, keep);
        setFile(null);
        setModalVisible(false);
        showSuccessToast(t("db.imported"))
    }

    const ExportModalContent = () => {

        return (
            <View style={styles.modalContent}>
                <Text style={styles.title}>{t("db.export-title")}</Text>
                <TextInput
                    style={styles.input}
                    value={fileName}
                    onChangeText={setFileName}
                    placeholder='ecoData.json'
                />
                <TouchableOpacity style={styles.buttonPrimary} onPress={exportToJson}>
                    <Text style={styles.buttonPrimaryText}>{t("db.export")}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const ImportModalContent = () => {
        return (
            <View style={[styles.modalContent, { gap: 4 }]}>
                <Text style={styles.title}>{t("db.import-title")}</Text>
                {
                    file ? (
                        <View style={{ gap: 6 }}>
                            <Text style={styles.sideLabel}>{t("db.file-uploaded")}</Text>
                            <Confirm
                                title={t("db.import-title")}
                                message={t("db.replace-msg")}
                                onConfirm={() => handleImport()}
                            >
                                <View style={styles.buttonPrimary} >
                                    <Text style={styles.buttonPrimaryText}>{t("db.import")}</Text>
                                </View>
                            </Confirm>
                        </View>
                    ) : (
                        <TouchableOpacity style={[styles.buttonBordered, { padding: 1 }]} onPress={importFromJson}>
                            <MaterialCommunityIcons name="file-upload-outline" size={28} color="black" />
                        </TouchableOpacity>
                    )
                }

            </View>
        )
    }

    const ModalContent = () => {
        switch (modalType) {
            case 'export':
                return <ExportModalContent />
            case 'import':
                return <ImportModalContent />
            default:
                return <></>
        }
    }


    return (
        <View style={[styles.container, styles.row]}>
            <TouchableOpacity onPress={() => handleModal("export")} style={styles.button}>
                <MaterialCommunityIcons name="database-export-outline" size={24} color="black" />
                <Text style={styles.sideLabel}>{t("db.export")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleModal("import")} style={styles.button}>
                <MaterialCommunityIcons name="database-import-outline" size={24} color="black" />
                <Text style={styles.sideLabel}>{t("db.import")}</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent>
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <ModalContent />
                    </View>
                </TouchableOpacity>
            </Modal>
            <Toast />
        </View>
    )
}

export default DBHandler