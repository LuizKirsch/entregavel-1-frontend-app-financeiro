import { BlurView } from "expo-blur";
import { Glass } from "@/constants/theme";
import { StyleSheet, type ViewProps } from "react-native";

type Props = ViewProps & { intensity?: number };

export function GlassView({ children, style, intensity = 40 }: Props) {
  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={[styles.glass, style]}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Glass.border,
    padding: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
