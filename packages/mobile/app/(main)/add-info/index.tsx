import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Header } from "../../../components/Header";
import { ArrowLeft } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button } from "../../../components/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import api from "../../../api/api";
import * as Haptics from "expo-haptics";

export default function AddInfoScreen() {
  const { data } = useLocalSearchParams<{ data: string }>();
  const insets = useSafeAreaInsets();

  if (!data) return null;

  const parsedData = JSON.parse(data) as {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    type: "PLANT" | "OXYGEN";
  };

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(parsedData.name);

  const onSave = async () => {
    setIsLoading(true);

    const response = await api.post("/api/devices", {
      id: parsedData.id,
      name,
      latitude: parsedData.latitude,
      longitude: parsedData.longitude,
      type: parsedData.type,
    });

    if (response.status === 200) {
      setIsLoading(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.back();
    }
  };

  return (
    <>
      <Header
        title="Check device info"
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

      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
        {/* Device Info Cards */}
        <View style={{ flexDirection: "row", marginBottom: 8 }}>
          <View
            style={{
              backgroundColor: "#f5f5f5",
              padding: 16,
              borderRadius: 12,
              flex: 1,
              margin: 4,
            }}
          >
            <Text style={{ fontSize: 12, color: "#666" }}>Device ID</Text>
            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 4 }}>
              {parsedData.id}
            </Text>
          </View>
        </View>

        {/* Device Name Input Card */}
        <View
          style={{
            backgroundColor: "#f5f5f5",
            padding: 16,
            borderRadius: 12,
            margin: 4,
          }}
        >
          <Text style={{ fontSize: 12, color: "#666" }}>Device name</Text>
          <TextInput
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              padding: 12,
              marginTop: 8,
              fontSize: 16,
            }}
            placeholder="Device name"
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>

      <View
        style={{
          padding: 16,
          position: "absolute",
          bottom: insets.bottom,
          width: "100%",
        }}
      >
        <Button isLoading={isLoading} onPress={onSave}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>Save</Text>
        </Button>
      </View>
    </>
  );
}
