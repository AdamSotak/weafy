import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Scan, Bell, RefreshCw, Settings } from "lucide-react-native";

const quickActions = [
  {
    id: 1,
    title: "Scan for Devices",
    icon: <Scan size={24} color="#007AFF" />,
    backgroundColor: "#E3F2FF",
  },
  {
    id: 2,
    title: "Notifications",
    icon: <Bell size={24} color="#FF9500" />,
    backgroundColor: "#FFF5E6",
  },
  {
    id: 3,
    title: "Sync Data",
    icon: <RefreshCw size={24} color="#34C759" />,
    backgroundColor: "#E6F8E9",
  },
  {
    id: 4,
    title: "Settings",
    icon: <Settings size={24} color="#5856D6" />,
    backgroundColor: "#EEEEFF",
  },
];

export const QuickActions = () => {
  return (
    <View style={{ marginVertical: 8, marginBottom: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Quick Actions
      </Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={{
              flex: 1,
              minWidth: "48%",
              padding: 16,
              borderRadius: 12,
              backgroundColor: action.backgroundColor,
              alignItems: "center",
              flexDirection: "row",
            }}
            onPress={() => {
              console.log(`Pressed ${action.title}`);
              if (action.title === "Settings") {
                router.push("/settings");
              }
            }}
          >
            {action.icon}
            <Text style={{ marginLeft: 12, fontWeight: "500" }}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
