import { View, Text, ScrollView } from "react-native";
import { Header } from "../../../components/Header";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Smartphone,
  HelpCircle,
  ChevronRight,
} from "lucide-react-native";

const settingsGroups = [
  {
    id: 1,
    title: "Account",
    icon: <User size={24} color="#007AFF" />,
    items: ["Profile", "Security", "Preferences"],
  },
  {
    id: 2,
    title: "Notifications",
    icon: <Bell size={24} color="#FF9500" />,
    items: ["Push Notifications", "Email Alerts", "In-App Notifications"],
  },
  {
    id: 3,
    title: "Privacy",
    icon: <Shield size={24} color="#34C759" />,
    items: ["Data Sharing", "App Permissions", "Privacy Policy"],
  },
  {
    id: 4,
    title: "Device Settings",
    icon: <Smartphone size={24} color="#5856D6" />,
    items: ["Connected Devices", "Sync Settings", "Storage"],
  },
  {
    id: 5,
    title: "Support",
    icon: <HelpCircle size={24} color="#FF3B30" />,
    items: ["Help Center", "Contact Support", "FAQs"],
  },
];

export default function SettingsScreen() {
  const renderSettingItem = (item: string) => (
    <TouchableOpacity
      key={item}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
      }}
      onPress={() => console.log(`Pressed ${item}`)}
    >
      <Text style={{ flex: 1 }}>{item}</Text>
      <ChevronRight size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <>
      <Header
        title="Settings"
        leadingAction={
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: "#E3F2FF",
            }}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#007AFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: "#f5f5f5", marginTop: 12 }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {settingsGroups.map((group) => (
          <View key={group.id} style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginBottom: 6,
              }}
            >
              {group.icon}
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                {group.title}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 12,
                marginHorizontal: 16,
                overflow: "hidden",
              }}
            >
              {group.items.map(renderSettingItem)}
            </View>
          </View>
        ))}

        <View
          style={{ marginTop: 24, alignItems: "center", paddingHorizontal: 16 }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
            Created with ❤️ by
          </Text>
          <Text style={{ fontSize: 14, color: "#666", textAlign: "center" }}>
            Adam Soták{"\n"}
            Vladimír Jakabovič{"\n"}
            Adam Bednár{"\n"}
            Morten Lins{"\n"}
            Evelina Hofmane
          </Text>
          <Text style={{ fontSize: 12, color: "#999", marginTop: 8 }}>
            SDU Hackathon 2024
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
