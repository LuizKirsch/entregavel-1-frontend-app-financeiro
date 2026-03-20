import { BlurView } from "expo-blur";
import { Glass } from "@/constants/theme";
import { StyleSheet, View, type ViewProps } from "react-native";

export function SummaryCard({ children, style }: ViewProps) {
  return (
    <BlurView intensity={55} tint="dark" style={[styles.card, style]}>
      <View style={styles.orb1} />
      <View style={styles.orb2} />
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
  orb1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: "rgba(167,139,250,0.15)",
    top: -60,
    right: -40,
  },
  orb2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "rgba(52,211,153,0.08)",
    bottom: -30,
    left: -20,
  },
});
