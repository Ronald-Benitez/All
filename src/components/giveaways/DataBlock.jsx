import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'

function DataBlock({ data, children, label }) {
  const styles = useSelector((state) => state.styles.styles);

    if (data.length <= 0) return null

    return (
        <View style={styles.container}>
            <Text style={styles.subtitle}>{label}</Text>
            {data?.map((item, index) => (
                <View
                    style={[
                        styles.block,
                    ]}
                    key={index}
                >
                    {children && children(item)}
                </View>
            ))}
        </View>
    )
}

export default DataBlock