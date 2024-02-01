import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const AddExpense = ({ data, children, list, setList, style, index }) => {
    const styles = useSelector((state) => state.styles.styles);
    const [name, setName] = useState('')
    const [value, setValue] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isVisibile, setIsVisible] = useState(false)
    const { t } = useTranslation()

    useEffect(() => {
        if (data) {
            setName(data.name)
            setValue(data.value)
            setQuantity(data.quantity)
        }
    }, [data])

    const handleSave = () => {
        const newExpense = {
            name,
            value,
            quantity,
            amount: value * quantity,
        }

        if (!data) {
            setList([...list, newExpense])
        } else {
            const newList = [...list]
            newList[index] = newExpense
            setList(newList)
        }
        setIsVisible(false)
    }

    return (
        <>
            <TouchableOpacity
                onPress={() => setIsVisible(true)}
                style={style}
            >
                {children}
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisibile}
                onRequestClose={() => {
                    setIsVisible(false);
                }}
            >
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    onPress={() => setIsVisible(false)}
                >
                    <View style={[styles.modalContent]}>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.sideLabel}>{t("finances-feature.name")}</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            minWidth: 175,
                                            maxWidth: 200,
                                        },
                                    ]}
                                    placeholder="Name"
                                    onChangeText={(text) => setName(text)}
                                    multiline={true}
                                    value={name}
                                />
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <Text style={styles.sideLabel}>{t("finances-feature.value")}</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        { minWidth: 100 },
                                    ]}
                                    value={String(value)}
                                    placeholder="Value"
                                    onChangeText={(text) => setValue(text)}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.column}>
                                <Text style={styles.sideLabel}>{t("finances-feature.quantity")}</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        { minWidth: 100 },
                                    ]}
                                    value={String(quantity)}
                                    placeholder="Quantity"
                                    onChangeText={(text) => setQuantity(text)}
                                    keyboardType="numeric"
                                />
                            </View>

                        </View>
                        <View style={styles.row}>
                            <View style={styles.column}>
                                <View style={styles.row}>
                                    <TouchableOpacity
                                        style={[styles.buttonBordered]}
                                        onPress={() => handleSave()}
                                    >
                                        {data ?
                                            <MaterialCommunityIcons name="cart-check" size={15} color="black" />
                                            :
                                            <MaterialCommunityIcons name="cart-plus" size={15} color="black" />
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.buttonBordered}
                                        onPress={() => setIsVisible(false)}
                                    >
                                        <Feather name="x" size={15} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

export default AddExpense