import { MaterialIcons } from "@expo/vector-icons";
import { SummaryCard } from "@/components/summary-card";
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

  useEffect(() => {
    load();
  }, [load]);

  const totalEntradas = transactions
    .filter((t) => t.type === "entrada")
    .reduce((s, t) => s + t.amount, 0);
  const totalSaidas = transactions
    .filter((t) => t.type === "saida")
    .reduce((s, t) => s + t.amount, 0);
  const saldo = totalEntradas - totalSaidas;

  function handleDelete(id: number) {
    Alert.alert("Deletar", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Deletar",
        style: "destructive",
        onPress: () =>
          api
            .deleteTransaction(USER, id)
            .then(load)
            .catch(() => Alert.alert("Erro", "Não foi possível deletar.")),
      },
    ]);
  }

  function handleUpdateStatus(id: number, status: TransactionStatus) {
    api
      .updateStatus(USER, id, status)
      .then(load)
      .catch(() => Alert.alert("Erro", "Não foi possível atualizar o status."));
  }

  const entradas = transactions.filter((t) => t.type === "entrada");
  const saidas = transactions.filter((t) => t.type === "saida");

  return (
    <SafeAreaView style={styles.screen}>
      {/* Month selector */}
      <View style={styles.periodBar}>
        <Pressable onPress={() => setMonth(prevMonth(month))} style={styles.arrowBtn}>
          <MaterialIcons name="chevron-left" size={22} color="#6200EE" />
        </Pressable>
        <Text style={styles.monthText}>{fmtMonth(month)}</Text>
        <Pressable onPress={() => setMonth(nextMonth(month))} style={styles.arrowBtn}>
          <MaterialIcons name="chevron-right" size={22} color="#6200EE" />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color="#6200EE" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary */}
          <SummaryCard>
            <View style={styles.summaryMain}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryCaption}>Saldo do Mês</Text>
                <Text
                  style={[
                    styles.summaryValue,
                    { color: saldo >= 0 ? "#6200EE" : "#B00020" },
                  ]}
                >
                  {fmtAmount(saldo)}
                </Text>
              </View>
              <View style={styles.summaryStats}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Entradas</Text>
                  <Text style={[styles.statValue, { color: "#2E7D32" }]}>
                    {fmtAmount(totalEntradas)}
                  </Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Saídas</Text>
                  <Text style={[styles.statValue, { color: "#B00020" }]}>
                    {fmtAmount(totalSaidas)}
                  </Text>
                </View>
              </View>
            </View>
          </SummaryCard>

          {/* Entradas */}
          {entradas.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Entradas</Text>
                <Text style={[styles.sectionTotal, { color: "#2E7D32" }]}>
                  {fmtAmount(totalEntradas)}
                </Text>
              </View>
              {entradas.map((t) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  onEdit={() =>
                    router.push({
                      pathname: "/edit",
                      params: { id: t.id, user: USER },
                    } as Href)
                  }
                  onDelete={() => handleDelete(t.id)}
                  onUpdateStatus={(s) => handleUpdateStatus(t.id, s)}
                />
              ))}
            </View>
          )}

          {/* Saídas */}
          {saidas.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Saídas</Text>
                <Text style={[styles.sectionTotal, { color: "#B00020" }]}>
                  {fmtAmount(totalSaidas)}
                </Text>
              </View>
              {saidas.map((t) => (
                <TransactionRow
                  key={t.id}
                  transaction={t}
                  onEdit={() =>
                    router.push({
                      pathname: "/edit",
                      params: { id: t.id, user: USER },
                    } as Href)
                  }
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

      <View style={styles.bottomNavWrap}>
        <Pressable style={styles.navButtonActive}>
          <MaterialIcons name="home" size={22} color="#4800B2" />
          <Text style={styles.navTextActive}>Inicio</Text>
        </Pressable>
        <Pressable
          style={styles.navButton}
          onPress={() =>
            router.push({ pathname: "/create", params: { user: USER } } as Href)
          }
        >
          <MaterialIcons name="add-circle" size={22} color="#8E8A99" />
          <Text style={styles.navText}>Adicionar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const STATUS_LABELS: Record<TransactionStatus, string> = {
  pendente: "Pendente",
  pago: "Pago",
  recebido: "Recebido",
};

const STATUS_COLORS: Record<TransactionStatus, string> = {
  pendente: "#F9A825",
  pago: "#2E7D32",
  recebido: "#1565C0",
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
      ? t.status === "recebido"
        ? "pendente"
        : "recebido"
      : t.status === "pago"
      ? "pendente"
      : "pago";

  return (
    <Pressable
      onPress={onEdit}
      style={({ pressed }) => [styles.expenseRow, pressed && styles.rowPressed]}
    >
      <View style={styles.expenseLeft}>
        <View
          style={[
            styles.expenseIconWrap,
            { backgroundColor: t.type === "entrada" ? "#E8F5E9" : "#FCE4EC" },
          ]}
        >
          <MaterialIcons
            name={t.type === "entrada" ? "arrow-downward" : "arrow-upward"}
            size={21}
            color={t.type === "entrada" ? "#2E7D32" : "#B00020"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.expenseTitle} numberOfLines={1}>
            {t.description}
          </Text>
          <Text style={styles.expenseCategory}>{t.month}</Text>
        </View>
      </View>

      <View style={styles.expenseRight}>
        <Text
          style={[
            styles.expenseValue,
            { color: t.type === "entrada" ? "#2E7D32" : "#B00020" },
          ]}
        >
          {t.type === "entrada" ? "+" : "-"}
          {fmtAmount(t.amount)}
        </Text>
        <View style={styles.rowActions}>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onUpdateStatus(nextStatus);
            }}
            style={[
              styles.statusBadge,
              { backgroundColor: STATUS_COLORS[t.status] + "22" },
            ]}
          >
            <Text style={[styles.statusText, { color: STATUS_COLORS[t.status] }]}>
              {STATUS_LABELS[t.status]}
            </Text>
          </Pressable>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={styles.deleteBtn}
          >
            <MaterialIcons name="delete-outline" size={18} color="#B00020" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAFAFA" },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 130,
    gap: 26,
  },
  periodBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 50,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFE8F4",
  },
  arrowBtn: { padding: 4 },
  monthText: { color: "#4800B2", fontSize: 15, fontWeight: "700" },
  summaryMain: { gap: 18 },
  summaryLeft: { gap: 6 },
  summaryCaption: {
    color: "#625B71",
    textTransform: "uppercase",
    letterSpacing: 1,
    fontSize: 11,
    fontWeight: "600",
  },
  summaryValue: { fontSize: 36, fontWeight: "800", letterSpacing: -0.8 },
  summaryStats: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "#F7F2FA",
    borderRadius: 12,
    padding: 12,
    gap: 3,
  },
  statLabel: { color: "#625B71", fontSize: 11 },
  statValue: { fontSize: 15, fontWeight: "700" },
  section: { gap: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  sectionTitle: { color: "#1D1B20", fontSize: 18, fontWeight: "700" },
  sectionTotal: { fontSize: 13, fontWeight: "600" },
  expenseRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  rowPressed: { opacity: 0.8 },
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
  expenseTitle: { color: "#1D1B20", fontSize: 15, fontWeight: "600" },
  expenseCategory: { color: "#625B71", fontSize: 13, marginTop: 2 },
  expenseRight: { alignItems: "flex-end", gap: 6, marginLeft: 10 },
  expenseValue: { fontSize: 15, fontWeight: "700" },
  rowActions: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase" },
  deleteBtn: { padding: 2 },
  empty: {
    textAlign: "center",
    color: "#625B71",
    fontSize: 14,
    marginTop: 40,
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
  navText: { color: "#8E8A99", fontSize: 12, fontWeight: "600" },
  navTextActive: { color: "#4800B2", fontSize: 12, fontWeight: "700" },
});
