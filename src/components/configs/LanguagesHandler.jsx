import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Storage } from "expo-storage";
import { useTranslation } from 'react-i18next'

import useStyle from "@/src/zustand/useStyle";
import OptionPicker from "@/src/components/configs/OptionPicker";

export default function LanguageHandler() {
    const [language, setLanguage] = useState("en");
    const styles = useStyle((state) => state.style);

    const { t, i18n } = useTranslation()

    useEffect(() => {
        Storage.getItem({ key: "language" }).then((value) => {
            console.log("value", value);
            if (value) {
                setLanguage(value);
            }
        });
    }, []);

    const handleLanguageChange = (value) => {
        console.log("value", value);
        setLanguage(value);
        Storage.setItem({ key: "language", value });
        i18n.changeLanguage(value);

    };

    return (
        <View style={styles.container}>
            <Text style={styles.dayDetailsTitle}>{t(`language.${language}`)}</Text>
            <OptionPicker
                options={[
                    { label: t("language.en"), value: "en" },
                    { label: t("language.es"), value: "es" },
                ]}
                value={language}
                onChange={handleLanguageChange}
            />
        </View>
    );
}