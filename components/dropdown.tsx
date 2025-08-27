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
    highZIndex?: boolean;
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
                                                       highZIndex = false,
                                                   }) => {
    const [items, setItems] = React.useState(options);

    useEffect(() => {
        setItems(options);
    }, [options]);

    // Calculate z-index values
    const baseZIndex = highZIndex ? 9999 : zIndex;
    const openZIndex = baseZIndex + 1;
    const dropdownZIndex = baseZIndex + 2;

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
                containerStyle={{ 
                    height: 56, 
                    width: '100%',
                    marginBottom: 8,
                    position: 'relative',
                }}
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    borderColor: open ? '#6366f1' : '#e2e8f0',
                    borderWidth: open ? 2.5 : 1.5,
                    shadowColor: open ? '#6366f1' : '#000',
                    shadowOffset: {
                        width: 0,
                        height: open ? 6 : 2,
                    },
                    shadowOpacity: open ? 0.2 : 0.08,
                    shadowRadius: open ? 12 : 6,
                    elevation: open ? 12 : 6,
                    zIndex: open ? openZIndex : baseZIndex,
                }}
                dropDownContainerStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderWidth: 1.5,
                    borderRadius: 20,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 8,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 16,
                    elevation: 12,
                    zIndex: dropdownZIndex,
                    marginTop: 12,
                    maxHeight: 300,
                    minHeight: 100,
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                }}
                listItemContainerStyle={{
                    borderBottomColor: '#f1f5f9',
                    borderBottomWidth: 1,
                    paddingVertical: 20,
                    paddingHorizontal: 24,
                    minHeight: 56,
                }}
                listItemLabelStyle={{
                    color: '#334155',
                    fontSize: 16,
                    fontWeight: '600',
                    lineHeight: 24,
                }}
                selectedItemLabelStyle={{
                    color: '#1e293b',
                    fontWeight: '800',
                }}
                selectedItemContainerStyle={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 16,
                    marginHorizontal: 16,
                    marginVertical: 8,
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                }}
                placeholderStyle={{
                    color: '#94a3b8',
                    fontSize: 16,
                    fontWeight: '500',
                }}
                closeOnBackPressed={true}
                showTickIcon={true}
                tickIconStyle={{
                    width: 22,
                    height: 22,
                    tintColor: '#6366f1',
                }}
                arrowIconStyle={{
                    width: 22,
                    height: 22,
                    tintColor: open ? '#6366f1' : '#64748b',
                }}
                searchable={false}
                autoScroll={true}
                scrollViewProps={{
                    showsVerticalScrollIndicator: false,
                    nestedScrollEnabled: true,
                }}
            />
        </View>
    );
};

export default DropdownMenu;
