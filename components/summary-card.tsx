import { StyleSheet, View, type ViewProps } from "react-native";

export function SummaryCard({ children, style }: ViewProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.glow} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#EADDFF",
    opacity: 0.35,
    top: -90,
    right: -70,
  },
});
