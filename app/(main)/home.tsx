import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SummaryCard } from "@/components/summary-card";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function fmt(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date(2024, 9, 1));
  const [endDate, setEndDate] = useState(new Date(2024, 9, 31));
  const [picker, setPicker] = useState<"start" | "end" | null>(null);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.periodBar}>
        <MaterialIcons name="date-range" size={18} color="#6200EE" />
        <Pressable onPress={() => setPicker("start")} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>{fmt(startDate)}</Text>
        </Pressable>
        <Text style={styles.dateSep}>→</Text>
        <Pressable onPress={() => setPicker("end")} style={styles.dateBtn}>
          <Text style={styles.dateBtnText}>{fmt(endDate)}</Text>
        </Pressable>
      </View>

      {picker !== null && (
        <DateTimePicker
          value={picker === "start" ? startDate : endDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(_, date) => {
            if (date)
              picker === "start" ? setStartDate(date) : setEndDate(date);
            if (Platform.OS !== "ios") setPicker(null);
          }}
          onTouchCancel={() => setPicker(null)}
        />
      )}

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <SummaryCard>
          <View style={styles.summaryMain}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryCaption}>Total Gasto em Outubro</Text>
              <View style={styles.summaryValueRow}>
                <Text style={styles.summaryValueMain}>R$ 2.450</Text>
                <Text style={styles.summaryValueCents}>,80</Text>
              </View>
              <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressText}>72%</Text>
              </View>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Orcamento</Text>
                <Text style={styles.statValue}>R$ 3.400,00</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Disponivel</Text>
                <Text style={[styles.statValue, styles.statValuePositive]}>
                  R$ 949,20
                </Text>
              </View>
            </View>
          </View>
        </SummaryCard>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hoje, 24 de Outubro</Text>
            <Text style={styles.sectionTotal}>R$ 142,50</Text>
          </View>

          <ExpenseRow
            icon="restaurant"
            iconBg="#EFE7FF"
            iconColor="#6200EE"
            title="Almoco Executivo"
            category="Alimentacao"
            value="R$ 45,00"
            tag="Credito"
          />
          <ExpenseRow
            icon="directions-car"
            iconBg="#FDECF3"
            iconColor="#A6417E"
            title="Combustivel Shell"
            category="Transporte"
            value="R$ 97,50"
            tag="Debito"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ontem, 23 de Outubro</Text>
            <Text style={styles.sectionTotal}>R$ 890,00</Text>
          </View>

          <ExpenseRow
            icon="shopping-bag"
            iconBg="#EEE6FF"
            iconColor="#6200EE"
            title="Supermercado Pao de Acucar"
            category="Compras"
            value="R$ 890,00"
            tag="Credito"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>21 de Outubro</Text>
            <Text style={styles.sectionTotal}>R$ 15,90</Text>
          </View>

          <ExpenseRow
            icon="subscriptions"
            iconBg="#ECEFF9"
            iconColor="#4A5A85"
            title="Spotify Premium"
            category="Lazer"
            value="R$ 15,90"
            tag="Fixo"
          />
        </View>
      </ScrollView>

      <View style={styles.bottomNavWrap}>
        <Pressable style={styles.navButtonActive}>
          <MaterialIcons name="home" size={22} color="#4800B2" />
          <Text style={styles.navTextActive}>Inicio</Text>
        </Pressable>

        <Pressable
          style={styles.navButton}
          onPress={() => router.push("/create" as Href)}
        >
          <MaterialIcons name="add-circle" size={22} color="#8E8A99" />
          <Text style={styles.navText}>Adicionar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

type ExpenseRowProps = {
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
  iconBg: string;
  iconColor: string;
  title: string;
  category: string;
  value: string;
  tag: string;
};

function ExpenseRow({
  icon,
  iconBg,
  iconColor,
  title,
  category,
  value,
  tag,
}: ExpenseRowProps) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push({ pathname: "/edit", params: { title, category, value, tag } } as Href)}
      style={({ pressed }) => [styles.expenseRow, pressed && styles.rowPressed]}
    >
      <View style={styles.expenseLeft}>
        <View style={[styles.expenseIconWrap, { backgroundColor: iconBg }]}>
          <MaterialIcons name={icon} size={21} color={iconColor} />
        </View>
        <View>
          <Text style={styles.expenseTitle}>{title}</Text>
          <Text style={styles.expenseCategory}>{category}</Text>
        </View>
      </View>

      <View style={styles.expenseRight}>
        <Text style={styles.expenseValue}>{value}</Text>
        <Text style={styles.expenseTag}>{tag}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 130,
    gap: 26,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    overflow: "hidden",
  },
  summaryGlow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#EADDFF",
    opacity: 0.35,
    top: -90,
    right: -70,
  },
  summaryMain: {
    gap: 18,
  },
  summaryLeft: {
    gap: 10,
  },
  periodBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFE8F4",
  },
  dateBtn: {
    backgroundColor: "#F3EDF7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dateBtnText: {
    color: "#4800B2",
    fontSize: 13,
    fontWeight: "600",
  },
  dateSep: {
    color: "#625B71",
    fontSize: 14,
  },
  summaryCaption: {
    color: "#625B71",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 11,
    fontWeight: "600",
  },
  summaryValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 2,
  },
  summaryValueMain: {
    color: "#6200EE",
    fontSize: 39,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  summaryValueCents: {
    color: "#6200EE",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 4,
  },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#EDE6F6",
    overflow: "hidden",
  },
  progressFill: {
    width: "72%",
    height: "100%",
    backgroundColor: "#6200EE",
  },
  progressText: {
    color: "#49454F",
    fontSize: 13,
    fontWeight: "700",
  },
  summaryStats: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F7F2FA",
    borderRadius: 12,
    padding: 12,
    gap: 3,
  },
  statLabel: {
    color: "#625B71",
    fontSize: 11,
  },
  statValue: {
    color: "#1D1B20",
    fontSize: 15,
    fontWeight: "700",
  },
  statValuePositive: {
    color: "#7D5260",
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  sectionTitle: {
    color: "#1D1B20",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionTotal: {
    color: "#625B71",
    fontSize: 13,
    fontWeight: "600",
  },
  expenseRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rowPressed: {
    opacity: 0.8,
  },
  expenseLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  expenseIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  expenseTitle: {
    color: "#1D1B20",
    fontSize: 15,
    fontWeight: "600",
  },
  expenseCategory: {
    color: "#625B71",
    fontSize: 13,
    marginTop: 2,
  },
  expenseRight: {
    alignItems: "flex-end",
    gap: 5,
    marginLeft: 10,
  },
  expenseValue: {
    color: "#1D1B20",
    fontSize: 16,
    fontWeight: "700",
  },
  expenseTag: {
    backgroundColor: "#E8DEF8",
    color: "#49454F",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    borderRadius: 999,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  bottomNavWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderTopWidth: 1,
    borderTopColor: "#EFE8F4",
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 110,
    borderRadius: 16,
    paddingVertical: 10,
    gap: 2,
  },
  navButtonActive: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 110,
    borderRadius: 16,
    paddingVertical: 10,
    gap: 2,
    backgroundColor: "#F3EDF7",
  },
  navText: {
    color: "#8E8A99",
    fontSize: 12,
    fontWeight: "600",
  },
  navTextActive: {
    color: "#4800B2",
    fontSize: 12,
    fontWeight: "700",
  },
});
