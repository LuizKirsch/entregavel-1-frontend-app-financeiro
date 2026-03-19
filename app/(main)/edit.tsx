import { SummaryCard } from "@/components/summary-card";
import { MaterialIcons } from "@expo/vector-icons";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaskInput, { createNumberMask } from "react-native-mask-input";
import { api, Transaction } from "@/services/api";

const USER_ID = "usuario_demo";

const currencyMask = createNumberMask({
  prefix: [],
  delimiter: ".",
  separator: ",",
  precision: 2,
});

const CATEGORIES = ["Alimentação", "Transporte", "Lazer", "Saúde", "Outros"];
const PAYMENTS: {
  label: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
}[] = [
  { label: "Cartão", icon: "credit-card" },
  { label: "Dinheiro", icon: "payments" },
  { label: "PIX", icon: "account-balance-wallet" },
];

export default function EditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    id: string; 
    description: string; 
    category: string; 
    amount: string; 
    status: string 
  }>();

  // Restaurando o estado inicial com os parâmetros da rota para não "quebrar" a UI
  const [amount, setAmount] = useState(params.amount || "");
  const [description, setDescription] = useState(params.description || "");
  const [category, setCategory] = useState(params.category || "Outros");
  const [payment, setPayment] = useState("Cartão"); // Mantendo sua UI original
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sincroniza com a API se necessário, mas a tela já abre com os dados acima
  useEffect(() => {
    if (params.id) {
      // Opcional: buscar dados mais recentes da API
    }
  }, [params.id]);

  const handleSave = async () => {
    if (!params.id || !amount || !description) {
      Alert.alert("Aviso", "Preencha todos os campos.");
      return;
    }

    try {
      setSaving(true);
      const numericAmount = parseFloat(
        amount.replace(/\./g, "").replace(",", ".")
      );

      await api.updateTransaction(USER_ID, params.id, {
        description,
        amount: numericAmount,
        type: "saida",
        status: params.status as any || "pendente",
        month: new Date().toISOString().slice(0, 7),
        category,
      });

      Alert.alert("Sucesso", "Alterações salvas!", [
        { text: "OK", onPress: () => router.push("/home" as Href) }
      ]);
    } catch (error: any) {
      const msg = error.data?.message || "Erro ao conectar com o servidor.";
      Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Excluir", "Deseja apagar esta transação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            setSaving(true);
            await api.deleteTransaction(USER_ID, params.id!);
            router.push("/home" as Href);
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir.");
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.editorialHeader}>
          <Text style={styles.pageTitle}>Editar Despesa</Text>
          <Text style={styles.pageSubtitle}>Atualize as informações do seu gasto.</Text>
        </View>

        <View style={styles.card}>
          <SummaryCard style={styles.amountCard}>
            <Text style={styles.label}>Valor do Gasto</Text>
            <View style={styles.amountWrap}>
              <Text style={styles.currencySymbol}>R$</Text>
              <MaskInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                mask={currencyMask}
                editable={!saving}
              />
            </View>
          </SummaryCard>

          <View style={styles.field}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              editable={!saving}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {CATEGORIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[styles.chip, category === c && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Restaurando sua seção de Forma de Pagamento */}
          <View style={styles.field}>
            <Text style={styles.label}>Forma de Pagamento</Text>
            <View style={styles.paymentRow}>
              {PAYMENTS.map((p) => (
                <Pressable
                  key={p.label}
                  onPress={() => setPayment(p.label)}
                  style={[styles.paymentCard, payment === p.label && styles.paymentCardActive]}
                >
                  <MaterialIcons name={p.icon} size={22} color={payment === p.label ? "#6200EE" : "#625B71"} />
                  <Text style={[styles.paymentLabel, payment === p.label && styles.paymentLabelActive]}>{p.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable style={[styles.btnSave, saving && styles.btnDisabled]} onPress={handleSave}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnSaveText}>Salvar Alterações</Text>}
            </Pressable>
            <Pressable style={styles.btnDelete} onPress={handleDelete}>
              <Text style={styles.btnDeleteText}>Excluir</Text>
            </Pressable>
            <Pressable style={styles.btnCancel} onPress={() => router.back()}>
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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
  amountInput: { flex: 1, fontSize: 36, fontWeight: "800", color: "#6200EE", paddingVertical: 18, paddingLeft: 8 },
  input: { backgroundColor: "#F7F2FA", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: "#1C1B1F" },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: { backgroundColor: "#F7F2FA", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: "#F3E5F5", borderWidth: 1.5, borderColor: "#6200EE" },
  chipText: { fontSize: 13, color: "#625B71", fontWeight: "500" },
  chipTextActive: { color: "#6200EE", fontWeight: "700" },
  paymentRow: { flexDirection: "row", gap: 10 },
  paymentCard: { flex: 1, backgroundColor: "#F7F2FA", borderRadius: 12, paddingVertical: 14, alignItems: "center", gap: 6, borderWidth: 2, borderColor: "transparent" },
  paymentCardActive: { backgroundColor: "#F3E5F5", borderColor: "#6200EE" },
  paymentLabel: { fontSize: 12, fontWeight: "600", color: "#625B71" },
  paymentLabelActive: { color: "#6200EE" },
  actions: { gap: 12, paddingTop: 6 },
  btnSave: { backgroundColor: "#6200EE", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  btnSaveText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  btnDelete: { backgroundColor: "#FDECEF", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  btnDeleteText: { color: "#D32F2F", fontSize: 16, fontWeight: "700" },
  btnCancel: { backgroundColor: "#E6E1E5", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  btnCancelText: { color: "#625B71", fontSize: 16, fontWeight: "700" },
  btnDisabled: { opacity: 0.6 },
});
