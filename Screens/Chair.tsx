import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import type { Screen } from "./App"; // Adjust path if needed

interface ChairScreenProps {
  goBack: () => void;
  goToScreen: (screen: Screen) => void;
}

const ChairScreen: React.FC<ChairScreenProps> = ({ goBack, goToScreen }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Living Room | Chair</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.contentArea}>
        <View style={styles.filterBar}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>☰ Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.clearFilters}>Clear Filters</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {[1, 2, 3, 4].map((_, index) => (
            <View key={index} style={styles.itemBox}>
              <View style={styles.itemImagePlaceholder} />
              <Text style={styles.itemName}>Name of Chair</Text>
              <Text style={styles.itemPrice}>₱ Price</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => goToScreen("profile")}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => goToScreen("home")}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => goToScreen("cart")}
        >
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => goToScreen("inbox")}
        >
          <Text style={styles.navIcon}>📥</Text>
          <Text style={styles.navLabel}>Inbox</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChairScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8C5B4",
  },
  contentArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3E2E22",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  backIcon: {
    color: "white",
    fontSize: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginHorizontal: 16,
    justifyContent: "space-between",
  },
  filterButton: {
    backgroundColor: "#3E2E22",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "600",
  },
  clearFilters: {
    color: "#6B4F3B",
    textDecorationLine: "underline",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 12,
  },
  itemBox: {
    width: "48%",
    backgroundColor: "#EBDDCB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  itemImagePlaceholder: {
    height: 80,
    backgroundColor: "#D8C5B4",
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontWeight: "600",
    color: "#3E2E22",
  },
  itemPrice: {
    color: "#6B4F3B",
  },
  bottomNav: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    color: "white",
    fontSize: 22,
  },
  navLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
});
