import { Text, View } from "react-native";
import { Activity, Signal, AlertTriangle, Heart } from "lucide-react-native";

interface StatsGridProps {
  stats: {
    activeDevices: number;
    batteryAlerts: number;
    signalStrength: string;
    incidents: number;
  };
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const renderStatCard = (
    icon: React.ReactNode,
    title: string,
    value: string | number,
    backgroundColor: string,
    textColor: string
  ) => (
    <View
      style={{
        backgroundColor: backgroundColor,
        padding: 16,
        borderRadius: 12,
        flex: 1,
        margin: 4,
        borderWidth: 1,
        borderColor: "lightgray",
      }}
    >
      {icon}
      <Text
        style={{ fontSize: 12, color: textColor, marginTop: 8, opacity: 0.8 }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginTop: 4,
          color: textColor,
        }}
      >
        {value}
      </Text>
    </View>
  );

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
        Stats
      </Text>
      <View style={{ flexDirection: "row" }}>
        {renderStatCard(
          <Activity size={24} color="#007AFF" />,
          "Active Devices",
          stats.activeDevices,
          "#f5f5f5",
          "#666"
        )}
        {renderStatCard(
          <Heart size={24} color="#FF9500" />,
          "Health Alerts",
          stats.batteryAlerts,
          "#f5f5f5",
          "#666"
        )}
      </View>
      <View style={{ flexDirection: "row" }}>
        {renderStatCard(
          <Signal size={24} color="#34C759" />,
          "Signal Strength",
          stats.signalStrength,
          "#f5f5f5",
          "#666"
        )}
        {renderStatCard(
          <AlertTriangle size={24} color="#FF3B30" />,
          "Incidents",
          stats.incidents,
          "#f5f5f5",
          "#666"
        )}
      </View>
    </View>
  );
};
