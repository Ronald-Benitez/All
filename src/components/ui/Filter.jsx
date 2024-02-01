import { useState, useEffect } from 'react'
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native'
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const Filter = ({ setFilters }) => {
    const styles = useSelector((state) => state.styles.styles);
    const [seeFilter, setSeeFilter] = useState(false);
    const [filter, setFilter] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        if (!filter || filter.trim() === "") {
            setFilters([]);
            return;
        }

        const filters = filter.trim().toLowerCase().split(/\s+/).filter(Boolean);
        setFilters(filters);
    }, [filter]);


    return (
        <>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    setSeeFilter(!seeFilter);
                }}
            >
                <AntDesign name="filter" size={18} color="black" />
            </TouchableOpacity>
            <Modal visible={seeFilter} transparent>
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    onPress={() => setSeeFilter(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.block}>
                            <Text style={styles.sideLabel}>{t("filter.label")} </Text>
                            <TextInput
                                style={styles.input}
                                value={filter}
                                onChangeText={setFilter}
                                placeholder={t("filter.placeholder")}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

export default Filter
