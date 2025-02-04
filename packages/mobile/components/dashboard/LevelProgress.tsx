import { Text, View } from "react-native";

interface LevelProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export const LevelProgress = ({
  level,
  xp,
  xpToNextLevel,
}: LevelProgressProps) => {
  return (
    <View
      style={{
        backgroundColor: "#E6F2FF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#CCE5FF",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "#007AFF",
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>{level}</Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#007AFF" }}>
            Level {level}
          </Text>
        </View>
        <Text style={{ color: "#0056B3" }}>
          {xp}/{xpToNextLevel} XP
        </Text>
      </View>
      <View
        style={{
          height: 12,
          backgroundColor: "#CCE5FF",
          borderRadius: 6,
          marginTop: 12,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${(xp / xpToNextLevel) * 100}%`,
            backgroundColor: "#007AFF",
            borderRadius: 6,
            shadowColor: "#007AFF",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 4,
          }}
        />
      </View>
    </View>
  );
};
