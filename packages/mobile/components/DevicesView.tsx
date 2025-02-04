import { Device } from "@prisma/client";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import api from "../api/api";
import { MoreHorizontal } from "lucide-react-native";
import { format } from "date-fns";
import { useFocusEffect } from "expo-router";

interface DevicesViewProps {
  onDeleteComplete?: (device: Device) => void;
  onDevicePress?: (device: Device) => void;
}

export const DevicesView = ({
  onDeleteComplete,
  onDevicePress,
}: DevicesViewProps) => {
  const [devices, setDevices] = useState<Device[]>([]);

  const fetchDevices = useCallback(async () => {
    const fetchDevices = async () => {
      const response = await api.get("/api/devices");
      if (response.status !== 200) return;
      setDevices(response.data);
    };

    fetchDevices();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, [fetchDevices])
  );

  const onDelete = async (id: string) => {
    Alert.alert(
      "Delete device",
      "Are you sure you want to delete this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const response = await api.delete(`/api/devices/${id}`);
            if (response.status !== 200) return;
            setDevices(devices.filter((device) => device.id !== id));
            onDeleteComplete?.(devices.find((device) => device.id === id)!);
          },
        },
      ]
    );
  };

  const renderDevice = ({ item: device }: { item: Device }) => (
    <TouchableOpacity onPress={() => onDevicePress?.(device)}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
          padding: 16,
          borderRadius: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "500" }}>{device.name}</Text>
          <Text style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
            Type: {device.type} • Created:{" "}
            {format(device.createdAt, "MMM d, yyyy")}
          </Text>
          <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
            Latitude: {device.latitude.toString().slice(0, 6)} • Longitude:{" "}
            {device.longitude.toString().slice(0, 6)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onDelete(device.id)}
          style={{ padding: 8 }}
        >
          <MoreHorizontal size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 16 }}>
        Devices
      </Text>

      <FlatList
        data={devices}
        keyExtractor={(device) => device.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={() => (
          <View
            style={{
              backgroundColor: "#f5f5f5",
              padding: 16,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                textAlign: "center",
                color: "#666",
              }}
            >
              No devices found
            </Text>
          </View>
        )}
        renderItem={renderDevice}
      />
    </View>
  );
};
