import Switch from "react-switch";

interface DefaultSwitchProps {
    onChange: (value: boolean) => void
    checked: boolean
}

export default function DefaultSwitch({ onChange, checked }: DefaultSwitchProps) {

    const handleChange = (value: boolean) => {
        onChange(value);
    }

    return (
        <Switch onChange={handleChange} checked={checked} className="nodrag"
            onColor="#86d3ff"
            onHandleColor="#2693e6"
            handleDiameter={10}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={10}
            width={20} />
    )
}