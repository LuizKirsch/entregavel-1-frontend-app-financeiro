import { SummaryCard } from "@/components/summary-card";
import { MaterialIcons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
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
import { api } from "@/services/api";

const USER_ID = "usuario_demo";

const currencyMask = createNumberMask({
  prefix: [],
  delimiter: ".",
  separator: ",",
  precision: 2,
});

const CATEGORIES = ["Alimentação", "Transporte", "Lazer", "Saúde", "Outros"];

export default function CreateScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Alimentação");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || !description) {
      Alert.alert("Erro", "Por favor, preencha o valor e a descrição.");
      return;
    }

    try {
      setLoading(true);
      
      // Converter valor formatado para número
      const numericAmount = parseFloat(
        amount.replace(/\./g, "").replace(",", ".")
      );

      const now = new Date();
      const monthStr = now.toISOString().slice(0, 7); // YYYY-MM

      await api.createTransaction(USER_ID, {
        description,
        amount: numericAmount,
        type: "saida",
        status: "pendente",
        month: monthStr,
        category,
      } as any);

      Alert.alert("Sucesso", "Despesa registrada com sucesso!", [
        { text: "OK", onPress: () => router.push("/home" as Href) }
      ]);
    } catch (error: any) {
      console.error(error);
      if (error.status === 422) {
        Alert.alert("Erro de Validação", "Os dados enviados são inválidos. Verifique os campos.");
      } else {
        Alert.alert("Erro", "Não foi possível salvar a despesa.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.editorialHeader}>
          <Text style={styles.pageTitle}>Nova Despesa</Text>
          <Text style={styles.pageSubtitle}>
            Registre seus gastos para manter sua saúde financeira em dia.
          </Text>
        </View>

        <View style={styles.card}>
          {/* Valor */}
          <SummaryCard style={styles.amountCard}>
            <Text style={styles.label}>Valor do Gasto</Text>
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
                editable={!loading}
              />
            </View>
          </SummaryCard>

          {/* Descrição */}
          <View style={styles.field}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Almoço Executivo"
              placeholderTextColor="#79747E"
              value={description}
              onChangeText={setDescription}
              editable={!loading}
            />
          </View>

          <View style={styles.row}>
            {/* Categoria */}
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipRow}>
                  {CATEGORIES.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setCategory(c)}
                      style={[styles.chip, category === c && styles.chipActive]}
                      disabled={loading}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          category === c && styles.chipTextActive,
                        ]}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.actions}>
            <Pressable
              style={[styles.btnSave, loading && styles.btnDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.btnSaveText}>Salvar Despesa</Text>
              )}
            </Pressable>
            <Pressable 
              style={styles.btnCancel} 
              onPress={() => router.back()}
              disabled={loading}
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 130,
    gap: 20,
  },
  editorialHeader: { gap: 6 },
  pageTitle: { fontSize: 34, fontWeight: "800", color: "#1C1B1F" },
  pageSubtitle: { fontSize: 14, color: "#625B71" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    gap: 22,
  },
  field: { gap: 8 },
  label: { fontSize: 13, fontWeight: "600", color: "#625B71" },
  amountCard: {
    backgroundColor: "#FDFBFF",
    gap: 8,
  },
  amountWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  row: { gap: 16 },
  chipRow: { flexDirection: "row", gap: 8 },
  chip: {
    backgroundColor: "#F7F2FA",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: "#F3E5F5",
    borderWidth: 1.5,
    borderColor: "#6200EE",
  },
  chipText: { fontSize: 13, color: "#625B71", fontWeight: "500" },
  chipTextActive: { color: "#6200EE", fontWeight: "700" },
  actions: { gap: 12, paddingTop: 6 },
  btnSave: {
    backgroundColor: "#6200EE",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.6,
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
