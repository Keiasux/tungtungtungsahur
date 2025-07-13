import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import { firestore } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { CartItem } from "./App";

interface CartScreenProps {
  onBack: () => void;
  total: number;
  cartItems: CartItem[];
  onIncrement: (id: string) => void;
  onRemove: (id: string) => void;
  userId: string;
}

const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  total,
  cartItems,
  onIncrement,
  onRemove,
  userId,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [paymentDocId, setPaymentDocId] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentDocId) return;

    const unsubscribe = onSnapshot(
      doc(firestore, "payments", paymentDocId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === "approved") {
            setModalVisible(false);
            Alert.alert("✅ Payment Approved", "Thank you for your payment!");
            setPaymentDocId(null);
          } else if (data.status === "declined") {
            setModalVisible(false);
            Alert.alert("❌ Payment Declined", "Please contact admin.");
            setPaymentDocId(null);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [paymentDocId]);

  const startPayment = async () => {
    try {
      setLoading(true);
      const generatedRef = Math.random().toString(36).substring(2, 10);

      // 🔎 Check if user already has a pending payment
      const q = query(
        collection(firestore, "payments"),
        where("userId", "==", userId),
        where("status", "==", "pending")
      );

      const existing = await getDocs(q);

      if (!existing.empty) {
        // ✅ Reuse existing pending payment
        const existingDoc = existing.docs[0];
        setPaymentDocId(existingDoc.id);
        setReferenceId(existingDoc.data().referenceId);
        setModalVisible(true);
      } else {
        // 🆕 Create new payment doc
        const docRef = await addDoc(collection(firestore, "payments"), {
          cartItems,
          amount: total,
          status: "pending",
          method: "QRPh",
          referenceId: generatedRef,
          userId: userId,
          createdAt: serverTimestamp(),
        });
        setPaymentDocId(docRef.id);
        setReferenceId(generatedRef);
        setModalVisible(true);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to record payment attempt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.buttonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Your Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View>
              <Text style={styles.itemText}>
                {item.name} x{item.quantity}
              </Text>
              <Text style={styles.itemText}>₱{item.price * item.quantity}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onIncrement(item.id)}
              >
                <Text style={styles.buttonText}>＋</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onRemove(item.id)}
              >
                <Text style={styles.buttonText}>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ₱{total}</Text>
        <TouchableOpacity
          style={[styles.actionButton, { marginTop: 20 }]}
          onPress={startPayment}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#3E2E22" />
          ) : (
            <Text style={styles.buttonText}>Pay with QRPh</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Scan to Pay</Text>

            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <Text style={styles.itemText}>Castro-G19-Thesis</Text>
              <Image
                source={require("../assets/code_hLnVjWzpqhh7xsKZLFg3EZcV.jpg")}
                style={{ width: 250, height: 350, resizeMode: "contain" }}
              />
              <Text style={styles.itemText}>Basta kaya i-scan, pwede yan!</Text>

              {referenceId && (
                <Text style={{ fontSize: 12, color: "#555", marginTop: 5 }}>
                  Reference ID: {referenceId}
                </Text>
              )}

              <Text
                style={{
                  fontSize: 12,
                  color: "#B00020",
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                ⚠ Please notify admin after paying. Admin will confirm your
                payment manually.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, { marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D8C5B4", padding: 20 },
  backBtn: { marginBottom: 10 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3E2E22",
    marginBottom: 10,
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E5D1BC",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  itemText: { fontSize: 16, color: "#3E2E22" },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionButton: {
    backgroundColor: "#C7AE93",
    padding: 10,
    borderRadius: 10,
    marginLeft: 5,
  },
  buttonText: { fontWeight: "600", color: "#3E2E22" },
  totalContainer: { marginTop: 20, alignItems: "flex-end" },
  totalText: { fontSize: 18, fontWeight: "bold", color: "#3E2E22" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
});
