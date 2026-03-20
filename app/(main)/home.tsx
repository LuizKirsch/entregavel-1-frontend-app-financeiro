import { MaterialIcons } from "@expo/vector-icons";
import { SummaryCard } from "@/components/summary-card";
import { Glass } from "@/constants/theme";
import { AnimatedOrb } from "@/components/animated-orb";
import { BlurView } from "expo-blur";
import { api, type Transaction, type TransactionStatus } from "@/services/api";
import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const USER = "alice";

function fmtMonth(month: string) {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function fmtAmount(amount: number) {
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function prevMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function nextMonth(month: string) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function HomeScreen() {
  const router = useRouter();
  const [month, setMonth] = useState(currentMonth());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api
      .listTransactions(USER, month)
      .then(setTransactions)
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [month]);

  useEffect(() => { load(); }, [load]);

  const totalEntradas = transactions.filter((t) => t.type === "entrada").reduce((s, t) => s + t.amount, 0);
  const totalSaidas = transactions.filter((t) => t.type === "saida").reduce((s, t) => s + t.amount, 0);
  const saldo = totalEntradas - totalSaidas;

  function handleDelete(id: number) {
    Alert.alert("Deletar", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: () =>
          api.deleteTransaction(USER, id).then(load)
            .catch(() => Alert.alert("Erro", "Não foi possível deletar.")),
      },
    ]);
  }

  function handleUpdateStatus(id: number, status: TransactionStatus) {
    api.updateStatus(USER, id, status).then(load)
      .catch(() => Alert.alert("Erro", "Não foi possível atualizar o status."));
  }

  const entradas = transactions.filter((t) => t.type === "entrada");
  const saidas = transactions.filter((t) => t.type === "saida");

  return (
    <SafeAreaView style={styles.screen}>
      <AnimatedOrb size={300} color="rgba(124,58,237,0.3)" top={-80} right={-60} delay={0} />
      <AnimatedOrb size={240} color="rgba(52,211,153,0.1)" top={300} left={-80} delay={1000} />
      <AnimatedOrb size={200} color="rgba(167,139,250,0.12)" bottom={100} right={-40} delay={500} />

      {/* Month selector */}
      <BlurView intensity={40} tint="dark" style={styles.periodBar}>
        <Pressable
          onPress={() => setMonth(prevMonth(month))}
          style={({ pressed }) => [styles.arrowBtn, pressed && { opacity: 0.6 }]}
        >
          <MaterialIcons name="chevron-left" size={22} color={Glass.accent} />
        </Pressable>
        <Text style={styles.monthText}>{fmtMonth(month)}</Text>
        <Pressable
          onPress={() => setMonth(nextMonth(month))}
          style={({ pressed }) => [styles.arrowBtn, pressed && { opacity: 0.6 }]}
        >
          <MaterialIcons name="chevron-right" size={22} color={Glass.accent} />
        </Pressable>
      </BlurView>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={Glass.accent} />
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <SummaryCard>
            <View style={styles.summaryMain}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryCaption}>Saldo do Mês</Text>
                <Text style={[styles.summaryValue, { color: saldo >= 0 ? Glass.income : Glass.expense }]}>
                  {fmtAmount(saldo)}
                </Text>
              </View>
              <View style={styles.summaryStats}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Entradas</Text>
                  <Text style={[styles.statValue, { color: Glass.income }]}>{fmtAmount(totalEntradas)}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Saídas</Text>
                  <Text style={[styles.statValue, { color: Glass.expense }]}>{fmtAmount(totalSaidas)}</Text>
                </View>
              </View>
            </View>
          </SummaryCard>

          {entradas.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Entradas</Text>
                <Text style={[styles.sectionTotal, { color: Glass.income }]}>{fmtAmount(totalEntradas)}</Text>
              </View>
              {entradas.map((t) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  onEdit={() => router.push({ pathname: "/edit", params: { id: t.id, user: USER } } as Href)}
                  onDelete={() => handleDelete(t.id)}
                  onUpdateStatus={(s) => handleUpdateStatus(t.id, s)}
                />
              ))}
            </View>
          )}

          {saidas.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Saídas</Text>
                <Text style={[styles.sectionTotal, { color: Glass.expense }]}>{fmtAmount(totalSaidas)}</Text>
              </View>
              {saidas.map((t) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  onEdit={() => router.push({ pathname: "/edit", params: { id: t.id, user: USER } } as Href)}
                  onDelete={() => handleDelete(t.id)}
                  onUpdateStatus={(s) => handleUpdateStatus(t.id, s)}
                />
              ))}
            </View>
          )}

          {transactions.length === 0 && (
            <Text style={styles.empty}>Nenhuma transação neste mês.</Text>
          )}
        </ScrollView>
      )}

      <BlurView intensity={60} tint="dark" style={styles.bottomNavWrap}>
        <Pressable style={styles.navButtonActive}>
          <MaterialIcons name="home" size={22} color={Glass.accent} />
          <Text style={styles.navTextActive}>Inicio</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.navButton, pressed && { opacity: 0.6 }]}
          onPress={() => router.push({ pathname: "/create", params: { user: USER } } as Href)}
        >
          <MaterialIcons name="add-circle" size={22} color={Glass.textSecondary} />
          <Text style={styles.navText}>Adicionar</Text>
        </Pressable>
      </BlurView>
    </SafeAreaView>
  );
}

const STATUS_LABELS: Record<TransactionStatus, string> = {
  pendente: "Pendente",
  pago: "Pago",
  recebido: "Recebido",
};

const STATUS_COLORS: Record<TransactionStatus, string> = {
  pendente: "#FBBF24",
  pago: "#34D399",
  recebido: "#60A5FA",
};

function TransactionRow({
  transaction: t,
  onEdit,
  onDelete,
  onUpdateStatus,
}: {
  transaction: Transaction;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateStatus: (s: TransactionStatus) => void;
}) {
  const nextStatus: TransactionStatus =
    t.type === "entrada"
      ? t.status === "recebido" ? "pendente" : "recebido"
      : t.status === "pago" ? "pendente" : "pago";

  return (
    <Pressable
      onPress={onEdit}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <BlurView intensity={30} tint="dark" style={styles.expenseRow}>
        <View style={styles.expenseLeft}>
          <View style={[styles.expenseIconWrap, {
            backgroundColor: t.type === "entrada" ? "rgba(52,211,153,0.15)" : "rgba(248,113,113,0.15)",
            borderColor: t.type === "entrada" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)",
          }]}>
            <MaterialIcons
              name={t.type === "entrada" ? "arrow-downward" : "arrow-upward"}
              size={20}
              color={t.type === "entrada" ? Glass.income : Glass.expense}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.expenseTitle} numberOfLines={1}>{t.description}</Text>
            <Text style={styles.expenseCategory}>{t.month}</Text>
          </View>
        </View>

        <View style={styles.expenseRight}>
          <Text style={[styles.expenseValue, { color: t.type === "entrada" ? Glass.income : Glass.expense }]}>
            {t.type === "entrada" ? "+" : "-"}{fmtAmount(t.amount)}
          </Text>
          <View style={styles.rowActions}>
            <Pressable
              onPress={(e) => { e.stopPropagation(); onUpdateStatus(nextStatus); }}
              style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[t.status] + "22", borderColor: STATUS_COLORS[t.status] + "44" }]}
            >
              <Text style={[styles.statusText, { color: STATUS_COLORS[t.status] }]}>
                {STATUS_LABELS[t.status]}
              </Text>
            </Pressable>
            <Pressable onPress={(e) => { e.stopPropagation(); onDelete(); }} style={styles.deleteBtn}>
              <MaterialIcons name="delete-outline" size={18} color={Glass.expense} />
            </Pressable>
          </View>
        </View>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Glass.bgDark },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 130,
    gap: 24,
  },
  periodBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 50,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: Glass.border,
  },
  arrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Glass.surface,
    borderWidth: 1,
    borderColor: Glass.border,
    alignItems: "center",
    justifyContent: "center",
  },
  monthText: {
    color: Glass.textPrimary,
    fontSize: 15,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  summaryMain: { gap: 18 },
  summaryLeft: { gap: 6 },
  summaryCaption: {
    color: Glass.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 11,
    fontWeight: "600",
  },
  summaryValue: { fontSize: 36, fontWeight: "800", letterSpacing: -0.8 },
  summaryStats: { flexDirection: "row", gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: Glass.surfaceInput,
    borderRadius: 16,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  statLabel: { color: Glass.textSecondary, fontSize: 11, fontWeight: "600" },
  statValue: { fontSize: 15, fontWeight: "700" },
  section: { gap: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  sectionTitle: { color: Glass.textPrimary, fontSize: 18, fontWeight: "700" },
  sectionTotal: { fontSize: 13, fontWeight: "600" },
  expenseRow: {
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Glass.border,
    overflow: "hidden",
  },
  expenseLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  expenseIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  expenseTitle: { color: Glass.textPrimary, fontSize: 15, fontWeight: "600" },
  expenseCategory: { color: Glass.textSecondary, fontSize: 12, marginTop: 2 },
  expenseRight: { alignItems: "flex-end", gap: 6, marginLeft: 10 },
  expenseValue: { fontSize: 14, fontWeight: "700" },
  rowActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  statusText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  deleteBtn: { padding: 2 },
  empty: { textAlign: "center", color: Glass.textSecondary, fontSize: 14, marginTop: 40 },
  bottomNavWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: Glass.border,
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
    backgroundColor: Glass.surface,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  navText: { color: Glass.textSecondary, fontSize: 12, fontWeight: "600" },
  navTextActive: { color: Glass.accent, fontSize: 12, fontWeight: "700" },
});
