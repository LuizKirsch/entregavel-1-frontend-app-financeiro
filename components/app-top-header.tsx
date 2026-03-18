import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, View } from "react-native";

type AppTopHeaderProps = {
  title?: string;
  dateValue?: string;
  onDateChange?: (date: string) => void;
};

export default function AppTopHeader({
  title = "Controle de Despesas",
  dateValue,
  onDateChange,
}: AppTopHeaderProps) {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.headerContent}>
        <View style={styles.leftGroup}>
          <View style={styles.avatarWrap}>
            <MaterialIcons name="person" size={18} color="#4800B2" />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.dateInputWrap}>
          <Text style={styles.dateLabel}>Período:</Text>
          <TextInput
            style={styles.dateInput}
            value={dateValue}
            onChangeText={onDateChange}
            placeholder="Selecione"
            placeholderTextColor="#79747E"
            keyboardType="default"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderBottomWidth: 1,
    borderBottomColor: "#F1EBF6",
    paddingTop: 20,
  },
  headerContent: {
    height: 72,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EADDFF",
  },
  title: {
    color: "#4800B2",
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  dateInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateLabel: {
    color: "#4800B2",
    fontSize: 13,
    fontWeight: "700",
  },
  dateInput: {
    backgroundColor: "#F3EDF7",
    color: "#4800B2",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 13,
    minWidth: 80,
    fontWeight: "700",
  },
});
