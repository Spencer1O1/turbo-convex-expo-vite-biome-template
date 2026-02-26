import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const quickActions = ["Report a problem", "Inspect item", "View history", "Open work order"];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Campus Asset Intelligence</Text>
      <Text style={styles.title}>Tap NFC tag → take photo → AI triages risk</Text>
      <Text style={styles.subtitle}>
        The mobile app is optimized for speed in the field: scan, report, and route maintenance in
        under 30 seconds.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>NFC Tag: A-204</Text>
        <Text style={styles.cardMuted}>Steam Valve Cluster • Engineering Basement</Text>
        {quickActions.map((action) => (
          <View key={action} style={styles.actionRow}>
            <Text style={styles.actionLabel}>{action}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>0.86</Text>
          <Text style={styles.metricLabel}>Priority</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>86</Text>
          <Text style={styles.metricLabel}>Risk value</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricValue}>2h</Text>
          <Text style={styles.metricLabel}>SLA target</Text>
        </View>
      </View>

      <StatusBar style="light" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#020617",
  },
  content: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  eyebrow: {
    color: "#67e8f9",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "700",
  },
  title: {
    color: "#f8fafc",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
  },
  subtitle: {
    color: "#cbd5e1",
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  cardTitle: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 18,
  },
  cardMuted: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 6,
  },
  actionRow: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#020617",
  },
  actionLabel: {
    color: "#bae6fd",
    fontWeight: "600",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricBox: {
    flex: 1,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  metricValue: {
    color: "#67e8f9",
    fontSize: 20,
    fontWeight: "700",
  },
  metricLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
});
