import { View, Text } from 'react-native'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import WithoutRegister from './WithoutRegister'

const ProfitsCard = ({ totalEarn, reload, year }) => {
    const styles = useSelector((state) => state.styles.styles);
    const [total, setTotal] = useState(0)
    const { t } = useTranslation()
    const register = useSelector((state) => state.group.group);

    useEffect(() => {
        setTotal(register?.incomes + totalEarn - register?.expenses)
    }, [register, totalEarn])

    const renderRow = (label, value) => (
        <View style={styles.row}>
            <Text style={[{ flex: 3 }]}>{label}</Text>
            <Text style={[{ flex: 1 }]}>$ {value}</Text>
        </View>
    );

    const fixed = (value) => parseFloat(value).toFixed(2)

    if (!register) return (
        <>
            <WithoutRegister reload={reload} savingsFlag={false} year={year} />
        </>
    )

    return (
        <>
            <View style={styles.block}>
                {renderRow(t("finances-feature.profits"), fixed(totalEarn || 0))}
                {renderRow(t("finances-feature.income"), fixed(register?.incomes || 0))}
                {renderRow(t("finances-feature.expenses"), `-${fixed(register?.expenses || 0)}`)}
                <View style={styles.separator} />
                {renderRow(t("finances-feature.balance"), fixed(total || 0))}
            </View>
        </>
    )
}

export default ProfitsCard