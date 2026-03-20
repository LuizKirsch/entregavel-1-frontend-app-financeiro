import { SummaryCard } from "@/components/summary-card";
import { api, type TransactionStatus, type TransactionType } from "@/services/api";
import { MaterialIcons } from "@expo/vector-icons";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MaskInput, { createNumberMask } from "react-native-mask-input";
import { MonthPicker } from "@/components/month-picker";

const currencyMask = createNumberMask({
  prefix: [],
  delimiter: ".",
  separator: ",",
  precision: 2,
});

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const TYPES: { label: string; value: TransactionType }[] = [
  { label: "Entrada", value: "entrada" },
  { label: "Saída", value: "saida" },
];

const STATUSES: { label: string; value: TransactionStatus }[] = [
  { label: "Pendente", value: "pendente" },
  { label: "Pago", value: "pago" },
  { label: "Recebido", value: "recebido" },
];

export default function CreateScreen() {
  const router = useRouter();
  const { user } = useLocalSearchParams<{ user: string }>();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TransactionType>("saida");
  const [status, setStatus] = useState<TransactionStatus>("pendente");
  const [month, setMonth] = useState(currentMonth());
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const numericAmount = parseFloat(
      amount.replace(/\./g, "").replace(",", ".")
    );
    if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }
    setSaving(true);
    try {
      await api.createTransaction(user ?? "alice", {
        description: description.trim(),
        amount: numericAmount,
        type,
        status,
        month,
      });
      router.push("/home" as Href);
    } catch (err: any) {
      Alert.alert("Erro", err?.message ?? "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.editorialHeader}>
          <Text style={styles.pageTitle}>Nova Transação</Text>
          <Text style={styles.pageSubtitle}>
            Registre uma entrada ou saída financeira.
          </Text>
        </View>

        <View style={styles.card}>
          {/* Valor */}
          <SummaryCard style={styles.amountCard}>
            <Text style={styles.label}>Valor</Text>
            <View style={styles.amountWrap}>
              <Text style={styles.currencySymbol}>R$</Text>
              <MaskInput
                style={styles.amountInput}
                placeholder="0,00"
                placeholderTextColor="rgba(98,0,238,0.2)"
                keyboardType="numeric"
                value={amount}
                onChangeText={(masked) => setAmount(masked)}
                mask={currencyMask}
              />
            </View>
          </SummaryCard>

          {/* Descrição */}
          <View style={styles.field}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Salário Mensal"
              placeholderTextColor="#79747E"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {/* Tipo */}
          <View style={styles.field}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.chipRow}>
              {TYPES.map((t) => (
                <Pressable
                  key={t.value}
                  onPress={() => setType(t.value)}
                  style={[styles.chip, type === t.value && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      type === t.value && styles.chipTextActive,
                    ]}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Status */}
          <View style={styles.field}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.chipRow}>
              {STATUSES.map((s) => (
                <Pressable
                  key={s.value}
                  onPress={() => setStatus(s.value)}
                  style={[styles.chip, status === s.value && styles.chipActive]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      status === s.value && styles.chipTextActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <MonthPicker value={month} onChange={setMonth} />

          <View style={styles.actions}>
            <Pressable
              style={[styles.btnSave, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.btnSaveText}>
                {saving ? "Salvando..." : "Salvar Transação"}
              </Text>
            </Pressable>
            <Pressable style={styles.btnCancel} onPress={() => router.back()}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable
          style={styles.navBtn}
          onPress={() => router.push("/home" as Href)}
        >
          <MaterialIcons name="home" size={22} color="#8E8A99" />
          <Text style={styles.navText}>Início</Text>
        </Pressable>
        <Pressable style={styles.navBtnActive}>
          <MaterialIcons name="add-circle" size={22} color="#4800B2" />
          <Text style={styles.navTextActive}>Adicionar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAFAFA" },
  content: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 130, gap: 20 },
  editorialHeader: { gap: 6 },
  pageTitle: { fontSize: 34, fontWeight: "800", color: "#1C1B1F" },
  pageSubtitle: { fontSize: 14, color: "#625B71" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, gap: 22 },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: "600", color: "#625B71" },
  amountCard: { backgroundColor: "#FDFBFF", gap: 8 },
  amountWrap: { flexDirection: "row", alignItems: "center" },
  currencySymbol: { fontSize: 22, fontWeight: "800", color: "#6200EE" },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: "800",
    color: "#6200EE",
    paddingVertical: 18,
    paddingLeft: 8,
  },
  input: {
    backgroundColor: "#F7F2FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1C1B1F",
  },
  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    backgroundColor: "#F7F2FA",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: "#F3E5F5", borderWidth: 1.5, borderColor: "#6200EE" },
  chipText: { fontSize: 13, color: "#625B71", fontWeight: "500" },
  chipTextActive: { color: "#6200EE", fontWeight: "700" },
  actions: { gap: 12, paddingTop: 6 },
  btnSave: {
    backgroundColor: "#6200EE",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnSaveText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  btnCancel: {
    backgroundColor: "#E6E1E5",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnCancelText: { color: "#625B71", fontSize: 16, fontWeight: "700" },
  bottomNav: {
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
  navBtn: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 110,
    borderRadius: 16,
    paddingVertical: 10,
    gap: 2,
  },
  navBtnActive: {
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
