import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import { CartItem } from "./App";

interface CartScreenProps {
  onBack: () => void;
  total: number;
  cartItems: CartItem[];
  onIncrement: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  total,
  cartItems,
  onIncrement,
  onRemove,
}) => {
  const handlePayment = async () => {
    try {
      const response = await fetch("https://api.paymongo.com/v1/links", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa("sk_live_your_secret_key_here" + ":"), // 🛑 Replace with your real secret key
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            attributes: {
              amount: total * 100, // Amount in centavos (₱1 = 100)
              description: "Furniture Checkout",
              remarks: "Thank you for shopping!",
              payment_method_types: ["gcash"],
              currency: "PHP",
            },
          },
        }),
      });

      const result = await response.json();

      if (result.data?.attributes?.checkout_url) {
        Linking.openURL(result.data.attributes.checkout_url);
      } else {
        console.log("Error:", result);
        Alert.alert("Payment failed", "Unable to create payment link.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong during payment.");
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

        {/* PAYMONGO PAYMENT BUTTON */}
        <TouchableOpacity
          style={[styles.actionButton, { marginTop: 20 }]}
          onPress={handlePayment}
        >
          <Text style={styles.buttonText}>Pay with GCash</Text>
        </TouchableOpacity>
      </View>
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
});
