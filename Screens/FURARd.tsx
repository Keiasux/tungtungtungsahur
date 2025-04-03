import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface ShopfurScreenProps {
  onAR: () => void;
  onCart: () => void;
  addToCart: () => void;
}

const ShopfurScreen: React.FC<ShopfurScreenProps> = ({
  onAR,
  onCart,
  addToCart,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>☰</Text>
        <View style={styles.logoContainer}>
          <Text style={styles.logoCart}>🛒</Text>
          <Text style={styles.logoText}>SHOPFUR</Text>
        </View>
        <Text style={styles.headerIcon}>⚙️</Text>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.sectionTitle}>
          Living Room <Text style={{ fontWeight: "700" }}>| TV Stand</Text>
        </Text>

        <View style={styles.card}>
          <View style={styles.productImage}>
            <Text style={styles.houseIcon}>🏠</Text>
          </View>
          <Text style={styles.productName}>Name of Chair</Text>
          <Text style={styles.productPrice}>₱299</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={addToCart}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onAR}>
              <Text style={styles.buttonText}>AR VIEW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottomNav}>
        <Text style={styles.navIcon}>👤</Text>
        <Text style={styles.navIcon}>🏠</Text>
        <TouchableOpacity onPress={onCart}>
          <Text style={styles.navIcon}>🛒</Text>
        </TouchableOpacity>
        <Text style={styles.navIcon}>🔔</Text>
      </View>
    </View>
  );
};

export default ShopfurScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D8C5B4" },
  header: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  headerIcon: { color: "white", fontSize: 24 },
  logoContainer: { alignItems: "center" },
  logoCart: { fontSize: 20, color: "white" },
  logoText: { fontSize: 12, color: "white", fontWeight: "bold" },
  mainContent: { flex: 1 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4D392B",
    marginTop: 20,
    marginLeft: 20,
  },
  card: {
    backgroundColor: "#E5D1BC",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  houseIcon: { fontSize: 36, color: "white" },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4D392B",
    marginTop: 10,
  },
  productPrice: { fontSize: 14, color: "#4D392B", marginBottom: 16 },
  buttonRow: { flexDirection: "row", gap: 12 },
  button: {
    backgroundColor: "#C7AE93",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  buttonText: { color: "#3E2E22", fontWeight: "600" },
  bottomNav: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
  },
  navIcon: { color: "white", fontSize: 22 },
});
