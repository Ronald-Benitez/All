import React from 'react'
import { View, Text } from 'react-native'

import useStyle from "@/src/zustand/useStyle";

function DataBlock({ data, children, label }) {
    const styles = useStyle((state) => state.style);

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