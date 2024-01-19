import { View, Text } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'

import useStyle from '@/src/zustand/useStyle'
import WithoutRegister from './WithoutRegister'

const BudgetsCard = ({ register, totalBudget, reload, year }) => {
    const styles = useStyle(state => state.style)
    const { t } = useTranslation()

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
            <WithoutRegister reload={reload} savingsFlag={false} year={year} />
        </>
    )

    const fixed = (value) => parseFloat(value).toFixed(2)

    const renderRow = (label, value) => (
        <View style={styles.row}>
            <Text style={{ flex: 3 }}>{label}</Text>
            <Text style={[{ flex: 1 }, getColor()]}>$ {value}</Text>
        </View>
    );

    return (
        <View style={styles.block}>
            {renderRow(t("finances-feature.income"), fixed(register?.incomes || 0))}
            {renderRow(t("finances-feature.expenses"), fixed(register?.expenses || 0))}
            {renderRow(t("finances-feature.budget"), fixed(totalBudget || 0))}

        </View>
    );
}

export default BudgetsCard