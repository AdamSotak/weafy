import { Text, TouchableOpacity, View } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { useEffect, useState } from "react";
import api from "../../api/api";

type WateringPrediction = {
  timeToTreshold?: number;
  units: "seconds";
};

export const WaterPlantsAlert = () => {
  const [wateringPrediction, setWateringPrediction] =
    useState<WateringPrediction | null>(null);

  useEffect(() => {
    const fetchWateringPrediction = async () => {
      const response = await api.get("/api/ml/watering");
      setWateringPrediction({
        timeToTreshold: response.data.time_to_threshold,
        units: response.data.units,
      });
    };

    fetchWateringPrediction();
  }, []);

  if (!wateringPrediction) {
    return null;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#E6F8E9",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#34C759",
      }}
    >
      <View
        style={{
          backgroundColor: "#34C759",
          padding: 8,
          borderRadius: 8,
          marginRight: 12,
        }}
      >
        <AlertTriangle size={24} color="white" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#34C759" }}>
          Time to Water Your Plants
        </Text>
        <Text style={{ color: "#666", marginTop: 4 }}>
          {wateringPrediction.timeToTreshold
            ? `Water in ${Math.floor(
                (wateringPrediction.timeToTreshold ?? 0) / 3600
              )} hours and ${Math.floor(
                ((wateringPrediction.timeToTreshold ?? 0) % 3600) / 60
              )} minutes`
            : "Water your plants now!"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
