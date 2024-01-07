import { useState, useEffect } from 'react'
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native'
import { AntDesign } from "@expo/vector-icons";
import useStyle from "@/src/zustand/useStyle";

const Filter = ({ setFilters }) => {
    const [seeFilter, setSeeFilter] = useState(false);
    const styles = useStyle((state) => state.style);
    const [filter, setFilter] = useState("");

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
                            <Text style={styles.sideLabel}>Filters </Text>
                            <TextInput
                                style={styles.input}
                                value={filter}
                                onChangeText={setFilter}
                                placeholder="You can add several"
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

export default Filter
