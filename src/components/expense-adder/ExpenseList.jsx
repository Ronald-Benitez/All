import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

import useStyle from '@/src/zustand/useStyle'
import AddExpense from './AddExpense';
import Confirm from '../configs/Confirm';

const ExpenseList = ({ expenses, setExpenses }) => {
    const styles = useStyle(state => state.style)
    const { t } = useTranslation()

    const handleRemove = (index) => {
        const newList = [...expenses]
        newList.splice(index, 1)
        setExpenses(newList)
    }

    return (
        <View
            style={[
                styles.block,
                { height: "75%" },
            ]}
        >
            <View
                style={[
                    styles.row,
                    { height: 30 },
                ]}
            >
                <View style={[styles.column, { flex: 2 }]}>
                    <Text style={[styles.sideLabel]}>{t("finances-feature.name")}</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                    <Text style={[styles.sideLabel]}>$</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                    <Text style={[styles.sideLabel]}>#</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                    <Text style={[styles.sideLabel]}>{t("finances-feature.total")}</Text>
                </View>
                <View style={[styles.column, { flex: 1 }]}>
                    <Text style={[styles.sideLabel]}></Text>
                </View>
            </View>
            <ScrollView>
                {expenses.map((expense, index) => {
                    return (
                        <View key={index} style={[styles.row]}>
                            <AddExpense
                                data={expense}
                                list={expenses}
                                setList={setExpenses}
                                style={[
                                    styles.row,
                                    styles.primaryBorder,
                                    {
                                        width: "80%",
                                        minHeight: 45,
                                    },
                                ]}
                                index={index}
                            >
                                <View
                                    key={index}
                                    style={styles.row}
                                >
                                    <View style={[styles.column, { flex: 2 }]}>
                                        <Text style={styles.sideLabel}>{expense.name}</Text>
                                    </View>
                                    <View style={[styles.column, { flex: 1 }]}>
                                        <Text style={styles.sideLabel}>${expense.value}</Text>
                                    </View>
                                    <View style={[styles.column, { flex: 1 }]}>
                                        <Text style={styles.sideLabel}>{expense.quantity}</Text>
                                    </View>
                                    <View style={[styles.column, { flex: 1 }]}>
                                        <Text style={styles.sideLabel}>${expense.amount}</Text>
                                    </View>
                                </View>
                            </AddExpense>
                            <View style={[styles.column, { flex: 1 }]}>
                                <Confirm
                                    onConfirm={() => handleRemove(index)}
                                    title={t("finances-feature.d-i-title")}
                                    message={t("finances-feature.d-i-msg")}
                                >
                                    <View
                                        style={[
                                            styles.buttonBordered,
                                            {
                                                width: "100%",
                                                padding: 6,
                                                alignItems: "center",
                                            },
                                        ]}
                                    >
                                        <MaterialCommunityIcons
                                            name="cart-remove"
                                            size={15}
                                            color="black"
                                        />
                                    </View>
                                </Confirm>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    )
}

export default ExpenseList