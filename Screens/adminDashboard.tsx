import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, firestore } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import type { Screen } from "./App";

interface AdminDashboardScreenProps {
  goToScreen: (target: Screen, params?: any) => void;
}

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  goToScreen,
}) => {
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [approvedProducts, setApprovedProducts] = useState<any[]>([]);
  const [rejectedProducts, setRejectedProducts] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );

  const fetchProductsByStatus = async (status: string) => {
    const q = query(
      collection(firestore, "products"),
      where("status", "==", status)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const fetchAllProducts = async () => {
    try {
      const pending = await fetchProductsByStatus("pending");
      const approved = await fetchProductsByStatus("approved");
      const rejected = await fetchProductsByStatus("rejected");
      setPendingProducts(pending);
      setApprovedProducts(approved);
      setRejectedProducts(rejected);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch products.");
      console.error(error);
    }
  };

  const checkIfAdmin = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Unauthorized", "No user logged in.");
        return;
      }

      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (!userDoc.exists()) {
        Alert.alert("Unauthorized", "User record not found.");
        return;
      }

      const userData = userDoc.data();
      if (userData.role === "admin") {
        setIsAdmin(true);
        await fetchAllProducts();
      } else {
        Alert.alert(
          "Access Denied",
          "You are not authorized to access this page."
        );
      }
    } catch (error) {
      console.error("Admin check failed:", error);
      Alert.alert("Error", "Failed to check admin status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIfAdmin();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const q = query(
        collection(firestore, "products"),
        where("status", "==", "pending")
      );
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingProducts(products);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch pending products.");
      console.error(error);
    }
  };

  const handleApproval = async (
    id: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const productRef = doc(firestore, "products", id);
      await updateDoc(productRef, { status: newStatus });

      if (newStatus === "approved") {
        const productSnap = await getDoc(productRef);
        const data = productSnap.data();

        if (
          data &&
          data.category &&
          data.name &&
          data.price &&
          data.imageUris &&
          data.glbFileName
        ) {
          const collectionMap: Record<string, string> = {
            Sofa: "livingroom_products",
            Chair: "livingroom_products",
            TVStand: "livingroom_products",
            // Add more as needed
          };

          const targetCollection = collectionMap[data.category];

          if (targetCollection) {
            await setDoc(doc(firestore, targetCollection, id), {
              name: data.name,
              price: data.price,
              category: data.category,
              image: data.imageUris[0],
              glbUri: data.glbFileName,
              status: "approved",
            });
          }
        }
      }

      Alert.alert("Success", `Product ${newStatus}`);
      fetchPendingProducts(); // 🔁 This is now valid
    } catch (error) {
      Alert.alert("Error", "Failed to update product status.");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      goToScreen("lreg");
    } catch (error) {
      Alert.alert("Error", "Failed to logout.");
    }
  };

  const renderProducts = (products: any[]) => {
    if (products.length === 0) return <Text>No products in this view.</Text>;
    return products.map((item) => (
      <View key={item.id} style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text>₱{item.price}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Status: {item.status}</Text>
        {view === "pending" && (
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={() => handleApproval(item.id, "approved")}
              style={[styles.button, { backgroundColor: "green" }]}
            >
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleApproval(item.id, "rejected")}
              style={[styles.button, { backgroundColor: "red" }]}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3E2E22" />
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text>You are not authorized to access this screen.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setView("pending")}>
          <Text style={[styles.tab, view === "pending" && styles.activeTab]}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setView("approved")}>
          <Text style={[styles.tab, view === "approved" && styles.activeTab]}>
            Approved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setView("rejected")}>
          <Text style={[styles.tab, view === "rejected" && styles.activeTab]}>
            Rejected
          </Text>
        </TouchableOpacity>
      </View>

      {renderProducts(
        view === "pending"
          ? pendingProducts
          : view === "approved"
          ? approvedProducts
          : rejectedProducts
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#3E2E22", marginTop: 30 }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  actions: { flexDirection: "row", marginTop: 10 },
  button: { flex: 1, padding: 10, marginHorizontal: 5, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tab: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: "#444",
  },
  activeTab: {
    fontWeight: "bold",
    color: "#3E2E22",
    textDecorationLine: "underline",
  },
});

export default AdminDashboardScreen;
