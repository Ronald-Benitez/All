import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import OptionPicker from "@/src/components/configs/OptionPicker";
import monthOptions from "@/constants/Months.json"


const MonthPicker = ({ month, onChange }) => {
    const { t } = useTranslation();
    const [transladtedMonthOptions, setTransladtedMonthOptions] = useState([]);

    useEffect(() => {
        setTransladtedMonthOptions(monthOptions.map((item) => ({
            ...item,
            label: t(`months.${item.label}`)
        })));
    }, []);

    return (
        <OptionPicker
            options={transladtedMonthOptions}
            value={transladtedMonthOptions.findIndex((item) => item.value === month)}
            onChange={onChange}
        />
    );
}

export default MonthPicker;
