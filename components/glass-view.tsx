import { Glass } from "@/constants/theme";
import { StyleSheet, View, type ViewProps } from "react-native";

export function GlassView({ children, style }: ViewProps) {
  return <View style={[styles.glass, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: Glass.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Glass.border,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
