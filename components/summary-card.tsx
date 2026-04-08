import { BlurView } from "expo-blur";
import { Glass } from "@/constants/theme";
import { StyleSheet, type ViewProps } from "react-native";

export function SummaryCard({ children, style }: ViewProps) {
  return (
    <BlurView intensity={55} tint="dark" style={[styles.card, style]}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Glass.borderStrong,
    padding: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
});
