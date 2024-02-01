import { View, Text } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import AddRegister from './AddRegister'

const WithoutRegistration = ({ reload, year }) => {
    const styles = useSelector((state) => state.styles.styles);
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