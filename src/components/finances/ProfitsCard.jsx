import { View, Text } from 'react-native'
import { useState, useEffect } from 'react'

import useStyle from '@/src/zustand/useStyle'
import WithoutRegister from './WithoutRegister'

const ProfitsCard = ({ totalEarn, register, reload, year }) => {
    const styles = useStyle(state => state.style)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        setTotal(register?.incomes + totalEarn)
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
                {renderRow("Profits", fixed(totalEarn || 0))}
                <Text style={[styles.sideLabel, { padding: 10 }]}>
                    With expenses of ${fixed(register?.expenses || 0)} and
                    incomes of ${fixed(register?.incomes || 0)} you will have
                    a balance of ${fixed(total - register?.expenses || 0)}
                </Text>
            </View>
        </>
    )
}

export default ProfitsCard