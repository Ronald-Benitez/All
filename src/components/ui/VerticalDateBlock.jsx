import { View, Text } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import { useSelector } from 'react-redux'

const VerticalDateBlock = ({ date, type }) => {
    const styles = useSelector((state) => state.styles.styles);
    const { t } = useTranslation()
    const d = moment(date, "YYYY/MM/DD")

    return (
        <View style={styles.row}>
            {["DD", "MMMM", "YYYY"].map((format, index) => (
                <Text
                    key={index}
                    style={[
                        styles.dateVerticalSmall,
                        type && type === "income" ? styles.income : styles.expense,
                    ]}
                >
                    {index === 1 ? t(`months-short.${d.format(format)}`) : d.format(format)}
                </Text>
            ))}
        </View>
    )
}

export default VerticalDateBlock