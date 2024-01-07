import { View, Text } from 'react-native'
import React from 'react'

import useStyle from '@/src/zustand/useStyle'
import WithoutRegister from './WithoutRegister'

const BudgetsCard = ({ register, totalBudget, reload }) => {
    const styles = useStyle(state => state.style)

    const getColor = () => {
        try {
            if (register.incomes > totalBudget) return styles.income;
            if (register.incomes < totalBudget) return styles.expense;
            return styles.goal;
        } catch (e) {
            return "";
        }
    };

    if (!register) return (
        <>
            <WithoutRegister reload={reload} savingsFlag={false} />
        </>
    )


    const renderRow = (label, value) => (
        <View style={styles.row}>
            <Text style={{ flex: 3 }}>{label}</Text>
            <Text style={[{ flex: 1 }, getColor()]}>$ {value}</Text>
        </View>
    );


    return (
        <View style={styles.block}>
            {renderRow("Incomes", register?.incomes || 0)}
            {renderRow("Expenses", register?.expenses || 0)}
            {renderRow("Budget", totalBudget?.toFixed(2) || 0)}

        </View>
    );
}

export default BudgetsCard