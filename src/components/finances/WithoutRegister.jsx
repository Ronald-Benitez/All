import { View, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

import useStyle from "@/src/zustand/useStyle";
import AddRegister from './AddRegister'

const WithoutRegistration = ({ reload, savingsFlag, year }) => {
    const styles = useStyle(state => state.style)
    const { t } = useTranslation()

    return (
        <>
            <View
                style={[
                    styles.block,
                    { padding: 0 }
                ]}
            >
                <Text style={[styles.sideLabel, { padding: 10 }]}>
                    {t("finances-feature.no-registers-msg")}
                </Text>
                <AddRegister
                    reload={reload}
                    savingsFlag={savingsFlag}
                    style={styles.button}
                    baseYear={year}
                >
                    <AntDesign name="addfolder" size={20} color="black" />
                </AddRegister>
            </View>
        </>
    )
}

export default WithoutRegistration