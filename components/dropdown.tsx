import React, { useEffect } from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type DropdownMenuProps = {
    placeholder: string;
    options: { label: string; value: string }[];
    selectedValue: string | null;
    onSelect: (value: string | null) => void;
    style?: StyleProp<ViewStyle>;
    zIndex: number;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
                                                       placeholder,
                                                       options,
                                                       selectedValue,
                                                       onSelect,
                                                       style,
                                                       zIndex,
                                                       open,
                                                       setOpen,
                                                   }) => {
    const [items, setItems] = React.useState(options);

    useEffect(() => {
        setItems(options);
    }, [options]);

    return (
        <View style={style}>
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
                containerStyle={{ height: 50, width: '100%' }}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    borderColor: '#ddd',
                }}
                dropDownContainerStyle={{
                    backgroundColor: 'rgba(241,241,241,0.95)',
                    borderColor: '#ddd',
                    zIndex: zIndex,
                }}
                listItemContainerStyle={{
                    borderBottomColor: '#a5a3a3',
                    borderBottomWidth: 2,
                }}
                listItemLabelStyle={{
                    color: '#333',
                }}
                selectedItemLabelStyle={{
                    color: '#007AFF',
                    fontWeight: '600',
                }}
                selectedItemContainerStyle={{
                    backgroundColor: '#e6f0ff',
                }}
                closeOnBackPressed={true}
            />
        </View>
    );
};

export default DropdownMenu;
