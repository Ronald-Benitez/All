import { View, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons'

import useStyle from "@/src/zustand/useStyle";
import AddRegister from './AddRegister'

const WithoutRegistration = ({ reload, savingsFlag }) => {
    const styles = useStyle(state => state.style)

    return (
        <>
            <View
                style={[
                    styles.block,
                    { padding: 0 }
                ]}
            >
                <Text style={[styles.sideLabel, { padding: 10 }]}>
                    It looks like you haven't created a group yet.
                    Create one to start managing your finances, this will
                    be used in the financial record, budget and profits.
                </Text>
                <AddRegister
                    reload={reload}
                    savingsFlag={savingsFlag}
                    style={styles.button}
                >
                    <AntDesign name="addfolder" size={20} color="black" />
                </AddRegister>
            </View>
        </>
    )
}

export default WithoutRegistration