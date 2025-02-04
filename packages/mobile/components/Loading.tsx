import { ActivityIndicator, Text, View } from "react-native";

export const Loading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <ActivityIndicator size="small" />
      <Text>Loading...</Text>
    </View>
  );
};
