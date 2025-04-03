import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { CartItem } from "./App";

interface CartScreenProps {
  cartItems: CartItem[];
  onBack: () => void;
  onIncrement: (id: number) => void;
  onRemove: (id: number) => void;
  total: number;
}

const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  onBack,
  onIncrement,
  onRemove,
  total,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.buttonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Your Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
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
    padding: 6,
    borderRadius: 6,
    marginLeft: 5,
  },
  buttonText: { fontWeight: "600", color: "#3E2E22" },
  totalContainer: { marginTop: 20, alignItems: "flex-end" },
  totalText: { fontSize: 18, fontWeight: "bold", color: "#3E2E22" },
});
