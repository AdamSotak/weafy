import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Dimensions, View } from "react-native";
import { DevicesView } from "./DevicesView";
import { Device } from "@prisma/client";
import { DashboardView } from "./DashboardView";
import { DeviceDashboard } from "./DeviceDashboard";
import { StatsView } from "./StatsView";

interface MainBottomSheetProps {
  markerId: string;
  onDevicePress?: (device: Device) => void;
  onClose: () => void;
  onDeviceDelete?: (device: Device) => void;
}

export const MainBottomSheet = ({
  markerId,
  onClose,
  onDeviceDelete,
  onDevicePress,
}: MainBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={markerId ? 1 : 0}
      snapPoints={["20%", "85%"]}
      maxDynamicContentSize={Dimensions.get("window").height * 0.85}
      onChange={(index) => {
        if (index === 0) {
          onClose();
        }
      }}
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
      }}
    >
      <BottomSheetScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {markerId ? (
          <DeviceDashboard deviceId={markerId} />
        ) : (
          <View style={{ gap: 12 }}>
            <DashboardView />
            <DevicesView
              onDeleteComplete={onDeviceDelete}
              onDevicePress={onDevicePress}
            />
            <StatsView />
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};
