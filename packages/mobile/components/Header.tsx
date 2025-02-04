import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HeaderProps {
  leadingAction?: React.ReactNode;
  trailingAction?: React.ReactNode;
  title: string;
}

export const Header = ({
  leadingAction,
  trailingAction,
  title,
}: HeaderProps) => {
  const insets = useSafeAreaInsets();

  const truncatedTitle =
    title?.length > 20 ? title.slice(0, 20) + "..." : title;

  return (
    <View style={[styles.container, { marginTop: insets.top }]}>
      <View style={{ zIndex: 10 }}>{leadingAction}</View>
      <Text style={styles.title}>{truncatedTitle}</Text>
      <View style={{ zIndex: 10 }}>{trailingAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    paddingHorizontal: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    position: "absolute",
    left: 0,
    right: 0,
  },
});
