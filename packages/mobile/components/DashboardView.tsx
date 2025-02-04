import { Text, View } from "react-native";
import { WaterPlantsAlert } from "./dashboard/WaterPlantsAlert";
import { LevelProgress } from "./dashboard/LevelProgress";
import { QuickActions } from "./dashboard/QuickActions";
import { StatsGrid } from "./dashboard/StatsGrid";

const dummyStats = {
  activeDevices: 12,
  batteryAlerts: 3,
  signalStrength: "85%",
  incidents: 2,
};

const gamificationData = {
  level: 12,
  xp: 2750,
  xpToNextLevel: 3000,
};

export const DashboardView = () => {
  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>
        Dashboard
      </Text>

      <WaterPlantsAlert />

      <LevelProgress
        level={gamificationData.level}
        xp={gamificationData.xp}
        xpToNextLevel={gamificationData.xpToNextLevel}
      />

      <QuickActions />

      <StatsGrid stats={dummyStats} />
    </View>
  );
};
