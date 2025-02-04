import { Clock } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

// Add color mapping for metrics
const metricColors = {
  uptime: { text: "#007AFF", bg: "#E3F2FF" },
  responseTime: { text: "#FF9500", bg: "#FFF5E6" },
  activeUsers: { text: "#34C759", bg: "#E6F8E9" },
  dataProcessed: { text: "#5856D6", bg: "#EEEEFF" },
};

export const StatsView = () => {
  const recentActivities = [
    { id: 1, title: "Device Connected", time: "2 mins ago" },
    { id: 2, title: "Battery Alert: XYZ789", time: "15 mins ago" },
    { id: 3, title: "System Update Completed", time: "1 hour ago" },
  ];

  const performanceMetrics = {
    uptime: "99.9%",
    responseTime: "120ms",
    activeUsers: "156",
    dataProcessed: "1.2 TB",
  };

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
          Recent Activity
        </Text>
        {recentActivities.map((activity) => (
          <View
            key={activity.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              backgroundColor: "#E3F2FF",
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            <Clock size={20} color="#007AFF" />
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontWeight: "500" }}>{activity.title}</Text>
              <Text style={{ color: "#666", fontSize: 12 }}>
                {activity.time}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 12 }}>
          Performance Metrics
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(performanceMetrics).map(([key, value]) => (
            <View
              key={key}
              style={{
                flex: 1,
                minWidth: "48%",
                padding: 16,
                backgroundColor:
                  metricColors[key as keyof typeof metricColors].bg,
                borderRadius: 12,
              }}
            >
              <Text
                style={{
                  color: metricColors[key as keyof typeof metricColors].text,
                  textTransform: "capitalize",
                }}
              >
                {key.replace(/([A-Z])/g, " $1")}
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 4 }}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
});
