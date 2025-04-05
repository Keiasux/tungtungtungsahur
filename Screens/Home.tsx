import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import type { Screen } from "../types"; // ✅ path depends on your folder structure

interface HomeScreenProps {
  onEnterShop?: () => void;
  onCart?: () => void;
  goToScreen?: (screen: Screen) => void; // ✅ FIXED TYPE
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onEnterShop,
  onCart,
  goToScreen,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      {/* Drawer Menu */}
      {menuVisible && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <Text style={styles.drawerTitle}>Living Room Furniture</Text>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                goToScreen?.("chair");
                toggleMenu();
              }}
            >
              <Text style={styles.drawerIcon}>🪑</Text>
              <Text style={styles.drawerLabel}>Chair</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                goToScreen?.("sofa");
                toggleMenu();
              }}
            >
              <Text style={styles.drawerIcon}>🛋️</Text>
              <Text style={styles.drawerLabel}>Sofa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                goToScreen?.("tvstand");
                toggleMenu();
              }}
            >
              <Text style={styles.drawerIcon}>📺</Text>
              <Text style={styles.drawerLabel}>TV Stand</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>
        <Image
          source={require("../assets/cart_icon.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.headerIcon}>⚙️</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <View style={styles.tabsContainer}>
          {["Study Room", "Bedroom", "Living Room", "Dining"].map((label) => (
            <View style={styles.tab} key={label}>
              <Text style={styles.tabText}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.imageSlider}>
          <Image
            source={require("../assets/cart_icon.png")}
            style={styles.sliderImage}
            resizeMode="cover"
          />
        </View>

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
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onCart}>
          <Text style={styles.navIcon}>🛒</Text>
          <Text style={styles.navLabel}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
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
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "70%",
    height: "100%",
    backgroundColor: "#3E2E22",
    padding: 20,
    zIndex: 2,
  },
  drawerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  drawerIcon: {
    fontSize: 20,
    marginRight: 12,
    color: "white",
  },
  drawerLabel: {
    fontSize: 18,
    color: "white",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
});
