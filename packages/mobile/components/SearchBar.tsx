import { TouchableOpacity } from "react-native";
import { Text } from "react-native";

interface SearchBarProps {
    onPress: () => void;
}

export const SearchBar = ({ onPress }: SearchBarProps) => {
    return (
        <TouchableOpacity
            style={{
                backgroundColor: 'white',
                padding: 10,
                paddingHorizontal: 20,
                borderRadius: 100,
                height: 45,
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
            onPress={onPress}>
            <Text style={{
                color: 'gray',
            }}>
                Ask questions...
            </Text>
        </TouchableOpacity>
    )
}
