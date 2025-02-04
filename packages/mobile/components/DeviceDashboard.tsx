import { useState } from "react";
import { useEffect } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import api from "../api/api";
import { Loading } from "./Loading";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { MoreHorizontal } from "lucide-react-native";
import { format } from "date-fns";
import { LineChart } from "react-native-gifted-charts";
import { Device } from "@prisma/client";

interface DeviceDashboardProps {
  deviceId: string;
}

type ChartData = {
  value: number;
  timestamp: Date;
};

const CHART_COLORS = {
  soilMoisture: {
    line: "#007AFF",
    gradient: "#E3F2FF",
  },
  temperature: {
    line: "#FF9500",
    gradient: "#FFF5E6",
  },
  humidity: {
    line: "#34C759",
    gradient: "#E6F8E9",
  },
  light: {
    line: "#5856D6",
    gradient: "#EEEEFF",
  },
};

export const DeviceDashboard = ({ deviceId }: DeviceDashboardProps) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);

  const [soilMoistureData, setSoilMoistureData] = useState<ChartData[]>([]);
  const [temperatureData, setTemperatureData] = useState<ChartData[]>([]);
  const [roomTemperatureData, setRoomTemperatureData] = useState<ChartData[]>(
    []
  );
  const [humidityData, setHumidityData] = useState<ChartData[]>([]);
  const [ambientLightData, setAmbientLightData] = useState<ChartData[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/devices/${deviceId}`).then((res) => {
      setDevice(res.data);
      setLoading(false);
    });
  }, [deviceId]);

  const fetchPlantCharts = async (deviceId: string) => {
    const soilMoistureResponse = await api.get(
      `/api/egress/plant/charts/moisture/${deviceId}`
    );
    if (soilMoistureResponse.status !== 200) return;
    setSoilMoistureData(soilMoistureResponse.data.slice(-100));

    const temperatureResponse = await api.get(
      `/api/egress/plant/charts/temperature/${deviceId}`
    );
    if (temperatureResponse.status !== 200) return;
    setTemperatureData(temperatureResponse.data.slice(-100));
  };

  const fetchOxygenCharts = async (deviceId: string) => {
    const roomTemperatureResponse = await api.get(
      `/api/egress/oxygen/charts/temperature/${deviceId}`
    );
    if (roomTemperatureResponse.status !== 200) return;
    setRoomTemperatureData(roomTemperatureResponse.data.slice(-100));

    const humidityResponse = await api.get(
      `/api/egress/oxygen/charts/humidity/${deviceId}`
    );
    if (humidityResponse.status !== 200) return;
    setHumidityData(humidityResponse.data.slice(-100));

    const ambientLightResponse = await api.get(
      `/api/egress/oxygen/charts/light/${deviceId}`
    );
    if (ambientLightResponse.status !== 200) return;
    setAmbientLightData(ambientLightResponse.data.slice(-100));
  };

  useEffect(() => {
    if (!device) return;

    setLoading(true);
    const load = async () => {
      if (device.type === "PLANT") {
        await fetchPlantCharts(deviceId);
      } else {
        await fetchOxygenCharts(deviceId);
      }
      setLoading(false);
    };

    load();
  }, [device]);

  const onDelete = async () => {
    Alert.alert(
      "Delete device",
      "Are you sure you want to delete this device?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ]
    );
  };

  if (
    loading ||
    (device?.type === "PLANT" &&
      (soilMoistureData.length === 0 || temperatureData.length === 0))
  ) {
    return (
      <View
        style={{
          position: "relative",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 100,
        }}
      >
        <Loading />
      </View>
    );
  }

  const getMinMaxValues = (data: ChartData[]) => {
    const values = data.map((d) => d.value);
    return {
      min: Math.floor(Math.min(...values)),
      max: Math.ceil(Math.max(...values)),
    };
  };

  const renderChartCard = (title: string, chart: React.ReactNode) => (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginVertical: 4,
        borderWidth: 1,
        borderColor: "#E6E6E6",
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 12,
          color: "#007AFF",
        }}
      >
        {title}
      </Text>
      {chart}
    </View>
  );

  const buildPlantCharts = () => {
    return (
      <>
        {renderChartCard(
          "Soil Moisture + Temperature",
          <LineChart
            data={soilMoistureData.map((d) => ({
              ...d,
              label: format(d.timestamp, "HH:mm"),
            }))}
            data2={temperatureData.map((d) => ({
              ...d,
              label: format(d.timestamp, "HH:mm"),
            }))}
            color={CHART_COLORS.soilMoisture.line}
            color2={CHART_COLORS.temperature.line}
            thickness={3}
            width={SCREEN_WIDTH - 120}
            scrollToEnd
            yAxisLabelSuffix=""
            yAxisLabelPrefix=""
            formatYLabel={(label) => Number(label).toFixed(1)}
            maxValue={getMinMaxValues(soilMoistureData).max}
            startFillColor={CHART_COLORS.soilMoisture.gradient}
            endFillColor={CHART_COLORS.soilMoisture.gradient}
            startFillColor2={CHART_COLORS.temperature.gradient}
            endFillColor2={CHART_COLORS.temperature.gradient}
            backgroundColor="#fff"
            xAxisColor="#666"
            yAxisColor="#666"
            yAxisTextStyle={{ color: "#666" }}
          />
        )}

        {renderChartCard(
          "Soil Moisture",
          <LineChart
            data={soilMoistureData.map((d) => ({
              ...d,
              label: format(d.timestamp, "HH:mm"),
            }))}
            color={CHART_COLORS.soilMoisture.line}
            thickness={3}
            width={SCREEN_WIDTH - 120}
            scrollToEnd
            yAxisLabelSuffix=""
            yAxisLabelPrefix=""
            formatYLabel={(label) => Number(label).toFixed(1)}
            startFillColor={CHART_COLORS.soilMoisture.gradient}
            endFillColor={CHART_COLORS.soilMoisture.gradient}
            backgroundColor="#fff"
            xAxisColor="#666"
            yAxisColor="#666"
            yAxisTextStyle={{ color: "#666" }}
          />
        )}

        {renderChartCard(
          "Soil Temperature",
          <LineChart
            data={temperatureData.map((d) => ({
              ...d,
              label: format(d.timestamp, "HH:mm"),
            }))}
            color={CHART_COLORS.temperature.line}
            thickness={3}
            width={SCREEN_WIDTH - 120}
            scrollToEnd
            yAxisLabelSuffix=""
            yAxisLabelPrefix=""
            formatYLabel={(label) => Number(label).toFixed(1)}
            startFillColor={CHART_COLORS.temperature.gradient}
            endFillColor={CHART_COLORS.temperature.gradient}
            backgroundColor="#fff"
            xAxisColor="#666"
            yAxisColor="#666"
            yAxisTextStyle={{ color: "#666" }}
          />
        )}
      </>
    );
  };

  const buildOxygenCharts = () => {
    return (
      <>
        {renderChartCard(
          "Room Temperature",
          <LineChart
            data={roomTemperatureData.map((d) => ({
              ...d,
              label: format(d.timestamp, "HH:mm"),
            }))}
            color={CHART_COLORS.temperature.line}
            thickness={3}
            width={SCREEN_WIDTH - 120}
            showXAxisIndices
            scrollToEnd
            yAxisLabelSuffix=""
            yAxisLabelPrefix=""
            formatYLabel={(label) => Number(label).toFixed(1)}
            startFillColor={CHART_COLORS.temperature.gradient}
            endFillColor={CHART_COLORS.temperature.gradient}
            backgroundColor="#fff"
            xAxisColor="#666"
            yAxisColor="#666"
            yAxisTextStyle={{ color: "#666" }}
          />
        )}

        {renderChartCard(
          "Air Humidity",
          <LineChart
            data={humidityData.map((d) => ({
              ...d,
              label: format(d.timestamp, "HH:mm"),
            }))}
            color={CHART_COLORS.humidity.line}
            thickness={3}
            width={SCREEN_WIDTH - 120}
            scrollToEnd
            yAxisLabelSuffix=""
            yAxisLabelPrefix=""
            formatYLabel={(label) => Number(label).toFixed(1)}
            startFillColor={CHART_COLORS.humidity.gradient}
            endFillColor={CHART_COLORS.humidity.gradient}
            backgroundColor="#fff"
            xAxisColor="#666"
            yAxisColor="#666"
            yAxisTextStyle={{ color: "#666" }}
          />
        )}

        {renderChartCard(
          "Ambient Light",
          <LineChart
            data={ambientLightData.map((d) => ({
              ...d,
              label: format(d.timestamp, "HH:mm"),
            }))}
            color={CHART_COLORS.light.line}
            thickness={3}
            width={SCREEN_WIDTH - 120}
            scrollToEnd
            yAxisLabelSuffix=""
            yAxisLabelPrefix=""
            formatYLabel={(label) => Number(label).toFixed(1)}
            startFillColor={CHART_COLORS.light.gradient}
            endFillColor={CHART_COLORS.light.gradient}
            backgroundColor="#fff"
            xAxisColor="#666"
            yAxisColor="#666"
            yAxisTextStyle={{ color: "#666" }}
          />
        )}
      </>
    );
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
          backgroundColor: "#E6F2FF",
          padding: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#CCE5FF",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "600", color: "#007AFF" }}>
          {device?.name}
        </Text>

        <TouchableOpacity
          onPress={onDelete}
          style={{
            padding: 8,
            borderRadius: 8,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: "#E6E6E6",
          }}
        >
          <MoreHorizontal size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {device?.type === "PLANT" ? buildPlantCharts() : buildOxygenCharts()}
    </View>
  );
};
