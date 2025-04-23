import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import type { Screen } from "./App";

interface FurnitureScreenProps {
  goBack: () => void;
  goToScreen: (screen: Screen) => void;
}

const FurnitureScreen: React.FC<FurnitureScreenProps> = ({
  goBack,
  goToScreen,
}) => {
  const screenMap: { [label: string]: Screen } = {
    "Living Room": "livingroom",
    "Bed room": "broomt",
    "Dining room": "droomt",
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/cart_icon.png")}
            style={styles.logoImage}
          />
          <Text style={styles.logoText}></Text>
        </View>
        <Text style={styles.headerIcon}>⚙️</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Furniture</Text>

        {Object.entries(screenMap).map(([label, screen]) => (
          <TouchableOpacity
            key={label}
            style={styles.menuItem}
            onPress={() => goToScreen(screen)}
          >
            <Text style={styles.menuText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomNav}>
        {["home", "inbox", "cart", "profile"].map((target, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => goToScreen(target as Screen)}
          >
            <Text style={styles.navIcon}>
              {["🏠", "📥", "🛒", "👤"][index]}
            </Text>
            <Text style={styles.navLabel}>
              {["Home", "Inbox", "Cart", "Profile"][index]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default FurnitureScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D8C5B4" },
  header: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerIcon: { color: "white", fontSize: 22 },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logoImage: { width: 30, height: 30, marginRight: 6 },
  logoText: { color: "white", fontWeight: "bold", fontSize: 16 },
  content: { padding: 20, flex: 1 },
  backButton: {
    backgroundColor: "#A89580",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  backButtonText: { color: "white", fontWeight: "600" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3E2E22",
    marginBottom: 20,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#CBB8A6",
    paddingVertical: 16,
  },
  menuText: { fontSize: 16, color: "#3E2E22", fontWeight: "500" },
  bottomNav: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  navItem: { alignItems: "center" },
  navIcon: { color: "white", fontSize: 22 },
  navLabel: { color: "white", fontSize: 12, marginTop: 2 },
});
