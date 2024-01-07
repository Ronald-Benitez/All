import monthOptions from "@/constants/Months.json"
import OptionPicker from "@/src/components/configs/OptionPicker";

const MonthPicker = ({ month, onChange }) => {
    return (
        <OptionPicker
            options={monthOptions}
            value={monthOptions.findIndex((item) => item.value === month)}
            onChange={onChange}
        />
    );
}

export default MonthPicker;
