import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  value: string; // "AAAA-MM"
  onChange: (month: string) => void;
  label?: string;
};

function toDate(month: string): Date {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1);
}

function toMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function fmtDisplay(month: string): string {
  return toDate(month).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function MonthPicker({ value, onChange, label = "Mês" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.btn} onPress={() => setOpen(true)}>
        <MaterialIcons name="calendar-today" size={18} color="#625B71" />
        <Text style={styles.btnText}>{fmtDisplay(value)}</Text>
      </Pressable>

      {open && (
        <DateTimePicker
          value={toDate(value)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, date) => {
            setOpen(Platform.OS === "ios");
            if (date) onChange(toMonth(date));
          }}
          onTouchCancel={() => setOpen(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: "600", color: "#625B71" },
  btn: {
    backgroundColor: "#F7F2FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  btnText: { fontSize: 15, color: "#1C1B1F", textTransform: "capitalize" },
});
