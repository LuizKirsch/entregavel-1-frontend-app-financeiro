import { MaterialIcons } from "@expo/vector-icons";
import { type Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.brandSection}>
          <View style={styles.logoBox}>
            <MaterialIcons
              name="account-balance-wallet"
              size={36}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.brandTitle}>Controle de Despesas</Text>
          <Text style={styles.brandSubtitle}>
            Sua seguranca financeira em primeiro lugar.
          </Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputBlock}>
            <Text style={styles.label}>E-MAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="nome@exemplo.com"
              placeholderTextColor="#7A7488"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputBlock}>
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>SENHA</Text>
              <Pressable>
                <Text style={styles.forgotText}>Esqueci minha senha</Text>
              </Pressable>
            </View>
            <TextInput
              style={styles.input}
              placeholder="********"
              placeholderTextColor="#7A7488"
              secureTextEntry
            />
          </View>

          <View style={styles.actionsBlock}>
            <Pressable
              onPress={() => router.push("/home" as Href)}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Entrar</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#4800B2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  brandTitle: {
    color: "#4800B2",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
    textAlign: "center",
    marginBottom: 8,
  },
  brandSubtitle: {
    color: "#494456",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 4,
  },
  inputBlock: {
    marginBottom: 22,
  },
  label: {
    color: "#494456",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  passwordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forgotText: {
    color: "#4800B2",
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    backgroundColor: "#F3F3F4",
    color: "#1A1C1C",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
  },
  actionsBlock: {
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#4800B2",
    borderRadius: 14,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E2E2",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#7A7488",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  secondaryButton: {
    backgroundColor: "#F3F3F4",
    borderRadius: 14,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#4800B2",
    fontSize: 17,
    fontWeight: "800",
  },
  buttonPressed: {
    opacity: 0.86,
  },
  footer: {
    marginTop: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    color: "#7A7488",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});
