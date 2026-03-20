import { MaterialIcons } from "@expo/vector-icons";
import { Glass } from "@/constants/theme";
import { AnimatedOrb } from "@/components/animated-orb";
import { BlurView } from "expo-blur";
import { type Href, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      {/* Background orbs */}
      <AnimatedOrb size={320} color="rgba(124,58,237,0.35)" top={-100} left={-80} delay={0} />
      <AnimatedOrb size={260} color="rgba(167,139,250,0.2)" top={180} right={-100} delay={800} />
      <AnimatedOrb size={200} color="rgba(52,211,153,0.12)" bottom={60} left={40} delay={1600} />

      <View style={styles.container}>
        <View style={styles.brandSection}>
          <View style={styles.logoBox}>
            <MaterialIcons name="account-balance-wallet" size={36} color={Glass.accent} />
          </View>
          <Text style={styles.brandTitle}>Controle de{"\n"}Despesas</Text>
          <Text style={styles.brandSubtitle}>
            Sua segurança financeira em primeiro lugar.
          </Text>
        </View>

        <BlurView intensity={50} tint="dark" style={styles.formCard}>
          <View style={styles.inputBlock}>
            <Text style={styles.label}>E-MAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="nome@exemplo.com"
              placeholderTextColor={Glass.textSecondary}
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
              placeholder="••••••••"
              placeholderTextColor={Glass.textSecondary}
              secureTextEntry
            />
          </View>

          <Pressable
            onPress={() => router.push("/home" as Href)}
            style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.primaryButtonText}>Entrar</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
          </Pressable>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Glass.bgDark },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 32,
  },
  brandSection: { alignItems: "center", marginBottom: 44 },
  logoBox: {
    width: 84,
    height: 84,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Glass.borderStrong,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    shadowColor: Glass.accentDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  brandTitle: {
    color: Glass.textPrimary,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
    marginBottom: 8,
  },
  brandSubtitle: {
    color: Glass.textSecondary,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Glass.border,
    padding: 24,
    gap: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  inputBlock: { gap: 8 },
  label: {
    color: Glass.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
  passwordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forgotText: { color: Glass.accent, fontSize: 13, fontWeight: "700" },
  input: {
    backgroundColor: Glass.surfaceInput,
    color: Glass.textPrimary,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Glass.border,
  },
  primaryButton: {
    backgroundColor: Glass.accentDark,
    borderRadius: 16,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: Glass.accent + "55",
    shadowColor: Glass.accentDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  primaryButtonText: { color: "#FFF", fontSize: 17, fontWeight: "800" },
});
