import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

interface HomeScreenProps {
  onEnterShop?: () => void;
  onCart?: () => void; // 👈 Add this
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onEnterShop, onCart }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>☰</Text>
        <Image
          source={require("../assets/cart_icon.png")} // Replace with actual logo
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.headerIcon}>⚙️</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {["Study Room", "Bedroom", "Living Room", "Dining"].map((label) => (
            <View style={styles.tab} key={label}>
              <Text style={styles.tabText}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Image Slider */}
        <View style={styles.imageSlider}>
          <Image
            source={require("../assets/cart_icon.png")} // Replace with actual image
            style={styles.sliderImage}
            resizeMode="cover"
          />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Shop by Category</Text>
        <View style={styles.categoryGrid}>
          {[
            { label: "Living Room", icon: "🛋️" },
            { label: "Dining", icon: "🍽️" },
            { label: "Bedroom", icon: "🛏️" },
            { label: "Comfort Room", icon: "🛁" },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.categoryButton}
              onPress={onEnterShop}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={styles.categoryLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            /* go to Profile */
          }}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            /* go to Home */
          }}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onCart}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            /* go to Inbox */
          }}
        >
          <Text style={styles.navIcon}>📥</Text>
          <Text style={styles.navLabel}>Inbox</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8C5B4",
  },
  header: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    color: "white",
    fontSize: 24,
  },
  logoImage: {
    width: 100,
    height: 40,
  },
  mainContent: {
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  tab: {
    backgroundColor: "#BFA890",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tabText: {
    color: "#3E2E22",
    fontWeight: "600",
  },
  imageSlider: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  sliderImage: {
    width: "100%",
    height: 180,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4D392B",
    marginTop: 20,
    marginLeft: 20,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  categoryButton: {
    width: "40%",
    backgroundColor: "#EBDDCB",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryLabel: {
    marginTop: 8,
    fontWeight: "600",
    color: "#3E2E22",
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
