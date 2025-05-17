import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type SeatMapProps = {
    seatCount: number;
    occupiedSeats: number[];
    onSeatPress?: (seatNumber: number) => void;
    editable: boolean;
};

export const SeatMap: React.FC<SeatMapProps> = ({
                                                    seatCount,
                                                    occupiedSeats,
                                                    onSeatPress,
                                                    editable= false
                                                }) => {
    if (seatCount % 2 !== 0) {
        throw new Error("seatCount must be an even number.");
    }

    const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

    const finalRowSeats = 6;
    const seatsPerRow = 4;
    const totalSeatsExcludingFinalRow = seatCount - finalRowSeats;

    const seatNumbers = Array.from({ length: seatCount }, (_, i) => i + 1);

    const handleSelectSeat = (seatNumber: number) => {
        if (!editable) return;

        if (occupiedSeats.includes(seatNumber)) return;

        if (seatNumber === selectedSeat) {
            // Deselect if clicked again
            setSelectedSeat(null);
            onSeatPress && onSeatPress(-1); // optional: -1 means no selection
        } else {
            setSelectedSeat(seatNumber);
            onSeatPress && onSeatPress(seatNumber);
        }
    };

    const renderSeat = (seatNumber: number) => {
        const isOccupied = occupiedSeats.includes(seatNumber);
        const isSelected = selectedSeat === seatNumber;

        return (
            <TouchableOpacity
                key={seatNumber}
                style={[
                    styles.seat,
                    isOccupied
                        ? styles.occupiedSeat
                        : isSelected
                            ? styles.selectedSeat
                            : styles.availableSeat,
                ]}
                onPress={() => handleSelectSeat(seatNumber)}
                disabled={isOccupied || !editable}
            >
                <Text
                    style={[
                        styles.seatLabel,
                        (isOccupied || isSelected) && styles.selectedSeatLabel,
                    ]}
                >
                    {seatNumber}
                </Text>
            </TouchableOpacity>
        );
    };

    const rows = [];
    for (let i = 0; i < totalSeatsExcludingFinalRow; i += seatsPerRow) {
        const rowSeats = seatNumbers.slice(i, i + seatsPerRow);

        rows.push(
            <View key={i} style={styles.row}>
                {/* Left two seats */}
                <View style={styles.side}>
                    {rowSeats.slice(0, 2).map(renderSeat)}
                </View>

                {/* Big middle spacer */}
                <View style={styles.middleSpacer} />

                {/* Right two seats */}
                <View style={styles.side}>
                    {rowSeats.slice(2, 4).map(renderSeat)}
                </View>
            </View>
        );
    }

    // Final row (6 seats side by side centered)
    const finalRow = seatNumbers.slice(totalSeatsExcludingFinalRow);

    return (
        <View style={styles.container}>
            {rows}

            <View style={styles.finalRow}>
                {finalRow.map(renderSeat)}
            </View>
        </View>
    );
};

const seatSize = 40;
const seatMargin = 2;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#f6d4d4',
        borderRadius: 12,
        marginVertical:20,
        marginHorizontal: 20
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
    },
    side: {
        flexDirection: 'row',
    },
    middleSpacer: {
        width: (seatSize + seatMargin * 2) * 2,
    },
    seat: {
        width: seatSize,
        height: seatSize,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#d6a8a8',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: seatMargin,
    },
    availableSeat: {
        backgroundColor: '#fdeaea',
    },
    occupiedSeat: {
        backgroundColor: '#d9534f',
    },
    selectedSeat: {
        backgroundColor: '#5cb85c',
    },
    seatLabel: {
        fontSize: 12,
        color: '#333',
    },
    selectedSeatLabel: {
        color: '#fff',
    },
    finalRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
});
