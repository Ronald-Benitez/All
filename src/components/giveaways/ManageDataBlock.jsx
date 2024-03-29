import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const ManageDataBlock = ({ value, onChange, handleDelete, handleAdd, label }) => {
  const styles = useSelector((state) => state.styles.styles);

    return (
        <View style={styles.col}>
            <Text style={styles.sideLabel}>{label}</Text>
            <View style={styles.row}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder={label}
                    label={label}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleAdd()}
                >
                    <MaterialCommunityIcons
                        name="playlist-plus"
                        size={18}
                        color="black"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleDelete()}
                >
                    <MaterialCommunityIcons
                        name="playlist-remove"
                        size={18}
                        color="black"
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ManageDataBlock