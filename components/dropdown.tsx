import React, { useEffect } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type DropdownMenuProps = {
    placeholder: string;
    options: { label: string; value: string }[];
    selectedValue: string | null;
    onSelect: (value: string | null) => void;
    style?: StyleProp<ViewStyle>;
    zIndex: number;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    highZIndex?: boolean;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
                                                       placeholder,
                                                       options,
                                                       selectedValue,
                                                       onSelect,
                                                       style,
                                                       open,
                                                       setOpen,
                                                   }) => {
    const [items, setItems] = React.useState(options);

    useEffect(() => {
        setItems(options);
    }, [options]);

    return (
        <View style={[style]}>
            <DropDownPicker
                open={open}
                value={selectedValue}
                items={items}
                setOpen={setOpen}
                setValue={(callback) => {
                    const newValue = callback(selectedValue);
                    onSelect(newValue);
                }}
                setItems={setItems}
                placeholder={placeholder}
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 12,
                    borderColor: open ? "#6366f1" : "#e2e8f0",
                    borderWidth: open ? 2 : 1,
                }}
                dropDownContainerStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderWidth: 1,
                    borderRadius: 12,
                    elevation: 5,
                }}
                listItemContainerStyle={{
                    borderBottomColor: "#f1f5f9",
                    borderBottomWidth: 1,
                }}
                listItemLabelStyle={{
                    color: "#334155",
                    fontSize: 16,
                }}
                selectedItemLabelStyle={{
                    color: "#1e293b",
                    fontWeight: "600",
                }}
                placeholderStyle={{
                    color: "#94a3b8",
                    fontSize: 16,
                }}
                showTickIcon={true}
                arrowIconStyle={{ width: 22, height: 22 }}
                tickIconStyle={{ width: 22, height: 22 }}
            />
        </View>
    );
};

export default DropdownMenu;
