import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SummaryCard } from "@/components/summary-card";
import { type Href, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { api, Transaction } from "@/services/api";

const USER_ID = "usuario_demo";

function fmt(d: Date) {
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function HomeScreen() {
  const router = useRouter();
  const [startDate, setStartDate] = useState(new Date(2026, 2, 1));
  const [endDate, setEndDate] = useState(new Date(2026, 2, 31));
  const [picker, setPicker] = useState<"start" | "end" | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const month = startDate.toISOString().slice(0, 7);
      const data = await api.getTransactions(USER_ID, month);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error(error);
      const msg = error.data?.message || "Servidor offline. Verifique a conexão.";
      Alert.alert("Aviso", msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [startDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "pendente" ? "pago" : "pendente";
      await api.updateTransactionStatus(USER_ID, id, nextStatus as any);
      fetchTransactions();
    } catch (error: any) {
      Alert.alert("Erro", "Falha ao atualizar status.");
    }
  };

  const totalSpent = transactions
    .filter((t) => t.type === "saida")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const budget = 3400;
  const available = budget - totalSpent;
  const progressPercent = Math.min(Math.round((totalSpent / budget) * 100), 100);

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
            if (date) picker === "start" ? setStartDate(date) : setEndDate(date);
            if (Platform.OS !== "ios") setPicker(null);
          }}
        />
      )}

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#6200EE" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <SummaryCard>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryCaption}>Total Gasto no Período</Text>
              <Text style={styles.summaryValueMain}>{formatCurrency(totalSpent)}</Text>
              <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                </View>
                <Text style={styles.progressText}>{progressPercent}%</Text>
              </View>
            </View>
          </SummaryCard>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suas Transações</Text>
            {transactions.length === 0 ? (
              <Text style={styles.emptyText}>Toque em + para adicionar ou puxe para atualizar.</Text>
            ) : (
              transactions.map((item) => (
                <ExpenseRow
                  key={item.id}
                  transaction={item}
                  onUpdateStatus={() => handleUpdateStatus(item.id!, item.status)}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}

      <View style={styles.bottomNav}>
        <Pressable style={styles.navBtnActive}>
          <MaterialIcons name="home" size={22} color="#4800B2" />
          <Text style={styles.navTextActive}>Inicio</Text>
        </Pressable>
        <Pressable style={styles.navBtn} onPress={() => router.push("/create" as Href)}>
          <MaterialIcons name="add-circle" size={22} color="#8E8A99" />
          <Text style={styles.navText}>Adicionar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function ExpenseRow({ transaction, onUpdateStatus }: { transaction: Transaction; onUpdateStatus: () => void }) {
  const router = useRouter();
  
  // Passando todos os dados para que a EditPage abra com os campos preenchidos na hora!
  const handlePress = () => {
    router.push({
      pathname: "/edit",
      params: { 
        id: transaction.id,
        description: transaction.description,
        category: transaction.category,
        amount: transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
        status: transaction.status
      }
    } as any);
  };

  return (
    <Pressable onPress={handlePress} style={styles.expenseRow}>
      <View style={styles.expenseLeft}>
        <View style={styles.expenseIconWrap}>
          <MaterialIcons name="shopping-bag" size={21} color="#6200EE" />
        </View>
        <View>
          <Text style={styles.expenseTitle}>{transaction.description}</Text>
          <Text style={styles.expenseCategory}>{transaction.category}</Text>
        </View>
      </View>
      <View style={styles.expenseRight}>
        <Text style={styles.expenseValue}>{formatCurrency(transaction.amount)}</Text>
        <Pressable onPress={(e) => { e.stopPropagation(); onUpdateStatus(); }} style={styles.tag}>
          <Text style={styles.tagText}>{transaction.status}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAFAFA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 130, gap: 20 },
  periodBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 12, paddingTop: 50, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#EFE8F4" },
  dateBtn: { backgroundColor: "#F3EDF7", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  dateBtnText: { color: "#4800B2", fontSize: 13, fontWeight: "600" },
  dateSep: { color: "#625B71" },
  summaryLeft: { gap: 8 },
  summaryCaption: { color: "#625B71", fontSize: 11, fontWeight: "600", textTransform: "uppercase" },
  summaryValueMain: { color: "#6200EE", fontSize: 32, fontWeight: "800" },
  progressWrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: "#EDE6F6", overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#6200EE" },
  progressText: { color: "#49454F", fontSize: 13, fontWeight: "700" },
  section: { gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1D1B20" },
  emptyText: { textAlign: "center", color: "#625B71", marginTop: 40 },
  expenseRow: { backgroundColor: "#FFFFFF", borderRadius: 14, padding: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  expenseLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  expenseIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F3EDF7", alignItems: "center", justifyContent: "center" },
  expenseTitle: { fontSize: 15, fontWeight: "600", color: "#1D1B20" },
  expenseCategory: { fontSize: 13, color: "#625B71" },
  expenseRight: { alignItems: "flex-end", gap: 4 },
  expenseValue: { fontSize: 16, fontWeight: "700", color: "#1D1B20" },
  tag: { backgroundColor: "#E8F5E9", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  tagText: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", color: "#2E7D32" },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#EEE", flexDirection: "row", justifyContent: "space-evenly", paddingBottom: 30, paddingTop: 10 },
  navBtn: { alignItems: "center" },
  navBtnActive: { alignItems: "center", backgroundColor: "#F3EDF7", paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12 },
  navText: { fontSize: 11, color: "#8E8A99" },
  navTextActive: { fontSize: 11, fontWeight: "700", color: "#4800B2" },
});
