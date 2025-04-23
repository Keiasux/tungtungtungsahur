import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { firestore } from "../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { Screen } from "../types";

interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
  glbUri: string;
  image: string;
}

interface BedroomScreenProps {
  category: "Desks" | "Wardrobe" | "Bed";
  goToScreen: (screen: Screen, params?: any) => void;
  addToCart: (item: { id: string; name: string; price: number }) => void;
}

const categoryTitles = {
  Desks: "Desks",
  Wardrobe: "Wardrobe",
  Bed: "Bed",
};

const BedroomScreen: React.FC<BedroomScreenProps> = ({
  category,
  goToScreen,
  addToCart,
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  const toggleFilters = () => setShowFilters(!showFilters);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const productsCollection = collection(firestore, "bedroom_products");
        const productsQuery = query(
          productsCollection,
          where("category", "==", category)
        );
        const snapshot = await getDocs(productsQuery);

        const fetchedItems: Item[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Item[];

        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchItems();
  }, [category]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (item: Item) => {
    if (user) {
      addToCart(item);
      setSelectedItem(null);
    } else {
      setShowModal(true);
    }
  };

  if (sortOrder === "asc") items.sort((a, b) => a.price - b.price);
  else if (sortOrder === "desc") items.sort((a, b) => b.price - a.price);

  return (
    <View style={styles.container}>
             {/* Sidebar Drawer Menu */}
             {menuVisible && (
               <TouchableOpacity
                 style={styles.backdrop}
                 activeOpacity={1}
                 onPress={toggleMenu}
               >
                 <Animated.View
                   style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
                 >
                   <TouchableOpacity style={styles.backButton} onPress={toggleMenu}>
                     <Text style={styles.backButtonText}>←</Text>
                   </TouchableOpacity>
       
                   <TouchableOpacity
                     style={styles.menuItem}
                     onPress={() => goToScreen?.("furniture")}
                   >
                     <Text style={styles.menuText}>Furniture</Text>
                   </TouchableOpacity>
       
                   <View style={styles.menuItem}>
                     <Text style={styles.menuText}>Home Office</Text>
                   </View>
                   <View style={styles.menuItem}>
                     <Text style={styles.menuText}>Home Decoration</Text>
                   </View>
                   <View style={styles.menuItem}>
                     <Text style={styles.menuText}>Help</Text>
                   </View>
       
                   <View style={styles.drawerBottomImage}>
                     <Image
                       source={require("../assets/cart_icon.png")}
                       style={styles.sfImage}
                       resizeMode="contain"
                     />
                   </View>
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

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Bedroom | {categoryTitles[category]}
        </Text>

        <View style={styles.filterRow}>
          <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
            <Text style={styles.filterButtonText}>☰ Filters</Text>
          </TouchableOpacity>
          <Text style={styles.clearText} onPress={() => setSortOrder(null)}>
            Clear Filters
          </Text>
        </View>

        {showFilters && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterCategory}>Sort by Price:</Text>
            <View style={styles.filterOptionRow}>
              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => setSortOrder("asc")}
              >
                <Text style={styles.filterOptionText}>Low to High</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => setSortOrder("desc")}
              >
                <Text style={styles.filterOptionText}>High to Low</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {selectedItem ? (
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>
            Bedroom | {categoryTitles[category]}
          </Text>
          <View style={styles.itemDetailCard}>
            <Image source={{ uri: selectedItem.image }} style={{ width: 50, height: 50 }} />
            <Text style={styles.itemName}>{selectedItem.name}</Text>
            <Text style={styles.itemPrice}>₱ {selectedItem.price}</Text>
            <View style={styles.detailButtons}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={() => handleAddToCart(selectedItem)}
              >
                <Text style={styles.cartButtonText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arButton}
                onPress={() => goToScreen("ar", { uri: selectedItem.glbUri })}
              >
                <Text style={styles.arButtonText}>AR VIEW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemBox}
              onPress={() => setSelectedItem(item)}
            >
              <Image source={{ uri: item.image }} style={styles.itemImagePlaceholder} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₱ {item.price}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <BottomNav onNavigate={goToScreen} />

      {/* Login Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>You are not Logged in.</Text>
            <Text style={styles.modalText}>
              Do you want to Login to your Account or Create an Account?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.modalCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  goToScreen("lreg");
                }}
                style={styles.modalConfirm}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BedroomScreen;

const BottomNav = ({
  onNavigate,
}: {
  onNavigate: (screen: Screen, params?: any) => void;
}) => {
  const navItems: { icon: string; label: string; target: Screen }[] = [
    { icon: "🏠", label: "Home", target: "home" },
    { icon: "📥", label: "Inbox", target: "cart" },
    { icon: "🛒", label: "Cart", target: "cart" },
    { icon: "👤", label: "Profile", target: "profile" },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => onNavigate(item.target)}
        >
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={styles.navLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D8C5B4" },
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
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logo: { width: 30, height: 30, marginRight: 6 },
  logoText: { color: "white", fontWeight: "bold", fontSize: 16 },
  sectionHeader: { padding: 16 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3E2E22",
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterButton: {
    borderColor: "#3E2E22",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterButtonText: { color: "#3E2E22", fontWeight: "600" },
  clearText: {
    color: "#94775A",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  filterPanel: {
    backgroundColor: "#EBDDCB",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  filterCategory: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#3E2E22",
  },
  filterOptionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  filterOption: {
    backgroundColor: "#D8C5B4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterOptionText: {
    color: "#3E2E22",
    fontWeight: "600",
  },
  grid: { paddingHorizontal: 16 },
  itemBox: {
    width: "47%",
    backgroundColor: "#EBDDCB",
    padding: 12,
    borderRadius: 10,
    margin: 6,
  },
  itemImagePlaceholder: {
    height: 80,
    backgroundColor: "#D8C5B4",
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: { fontWeight: "600", color: "#3E2E22" },
  itemPrice: { color: "#6B4F3B" },
  detailsContainer: {
    padding: 20,
    flex: 1,
    alignItems: "center",
  },
  itemDetailCard: {
    backgroundColor: "#EBDDCB",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  detailButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cartButton: {
    backgroundColor: "#BFA890",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cartButtonText: {
    color: "#3E2E22",
    fontWeight: "600",
  },
  arButton: {
    backgroundColor: "#D8C5B4",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  arButtonText: {
    color: "#3E2E22",
    fontWeight: "600",
  },
  bottomNav: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  navItem: { alignItems: "center" },
  navIcon: { color: "white", fontSize: 22 },
  navLabel: { color: "white", fontSize: 12, marginTop: 2 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
    color: "#3E2E22",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#6B4F3B",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
  },
  modalCancel: {
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    backgroundColor: "#ccc",
    marginRight: 5,
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: "#6B4F3B",
    padding: 10,
    borderRadius: 6,
    marginRight: 5,
    marginTop: 10,
    maxWidth: 180
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  authStatus: {
    fontSize: 14,
    color: "#3E2E22",
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#CBB8A6",
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    color: "#3E2E22",
    fontWeight: "500",
  },
  drawerBottomImage: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: 40,
  },
  sfImage: {
    width: 100,
    height: 80,
  },
  logoImage: {
    width: 100,
    height: 40,
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
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "70%",
    height: "100%",
    backgroundColor: "#D8C5B4",
    padding: 20,
    zIndex: 2,
    justifyContent: "flex-start",
  },
  backButtonText: { color: "white", fontWeight: "600" },
  backButton: {
    backgroundColor: "#A89580",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },

});