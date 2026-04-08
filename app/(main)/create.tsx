import { MonthPicker } from "@/components/month-picker";
import { SummaryCard } from "@/components/summary-card";
import { Glass } from "@/constants/theme";
import {
    api,
    DEFAULT_USER,
    type TransactionStatus,
    type TransactionType,
} from "@/services/api";
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
      amount.replace(/\./g, "").replace(",", "."),
    );
    if (!description.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }
    setSaving(true);
    try {
      await api.createTransaction(user ?? DEFAULT_USER, {
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
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Nova Transação</Text>
          <Text style={styles.pageSubtitle}>
            Registre uma entrada ou saída financeira.
          </Text>
        </View>

        <View style={styles.card}>
          <SummaryCard style={styles.amountCard}>
            <Text style={styles.label}>Valor</Text>
            <View style={styles.amountWrap}>
              <Text style={styles.currencySymbol}>R$</Text>
              <MaskInput
                style={styles.amountInput}
                placeholder="0,00"
                placeholderTextColor={Glass.textSecondary}
                keyboardType="numeric"
                value={amount}
                onChangeText={(masked) => setAmount(masked)}
                mask={currencyMask}
              />
            </View>
          </SummaryCard>

          <View style={styles.field}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Salário Mensal"
              placeholderTextColor={Glass.textSecondary}
              value={description}
              onChangeText={setDescription}
            />
          </View>

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
              style={({ pressed }) => [
                styles.btnSave,
                (saving || pressed) && { opacity: 0.75 },
              ]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.btnSaveText}>
                {saving ? "Salvando..." : "Salvar Transação"}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.btnCancel,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => router.back()}
            >
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
          <MaterialIcons name="home" size={22} color={Glass.textSecondary} />
          <Text style={styles.navText}>Início</Text>
        </Pressable>
        <Pressable style={styles.navBtnActive}>
          <MaterialIcons name="add-circle" size={22} color={Glass.accent} />
          <Text style={styles.navTextActive}>Adicionar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Glass.bgDark },
  orb1: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(124,58,237,0.28)",
    top: -60,
    left: -60,
  },
  orb2: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(52,211,153,0.1)",
    bottom: 120,
    right: -50,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 130,
    gap: 20,
  },
  header: { gap: 6 },
  pageTitle: { fontSize: 32, fontWeight: "800", color: Glass.textPrimary },
  pageSubtitle: { fontSize: 14, color: Glass.textSecondary },
  card: {
    backgroundColor: Glass.surface,
    borderRadius: 24,
    padding: 24,
    gap: 22,
    borderWidth: 1,
    borderColor: Glass.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: "600", color: Glass.textSecondary },
  amountCard: { gap: 8 },
  amountWrap: { flexDirection: "row", alignItems: "center" },
  currencySymbol: { fontSize: 22, fontWeight: "800", color: Glass.accent },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: "800",
    color: Glass.accent,
    paddingVertical: 18,
    paddingLeft: 8,
  },
  input: {
    backgroundColor: Glass.surfaceInput,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Glass.textPrimary,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  chipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: {
    backgroundColor: Glass.surfaceInput,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  chipActive: {
    backgroundColor: "rgba(167,139,250,0.2)",
    borderColor: Glass.accent,
  },
  chipText: { fontSize: 13, color: Glass.textSecondary, fontWeight: "500" },
  chipTextActive: { color: Glass.accent, fontWeight: "700" },
  actions: { gap: 12, paddingTop: 6 },
  btnSave: {
    backgroundColor: Glass.accentDark,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Glass.accent + "55",
    shadowColor: Glass.accentDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  btnSaveText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  btnCancel: {
    backgroundColor: Glass.surfaceInput,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Glass.border,
  },
  btnCancelText: {
    color: Glass.textSecondary,
    fontSize: 16,
    fontWeight: "700",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(15,10,30,0.85)",
    borderTopWidth: 1,
    borderTopColor: Glass.border,
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
    backgroundColor: Glass.surface,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  navText: { color: Glass.textSecondary, fontSize: 12, fontWeight: "600" },
  navTextActive: { color: Glass.accent, fontSize: 12, fontWeight: "700" },
});
