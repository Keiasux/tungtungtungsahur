// ✅ App.tsx
import React, { useState } from "react";
import ShopfurScreen from "./FURARd";
import LoadingScreen from "./LoadingScreen";
import ARScene from "./ARScene";
import CartScreen from "./CartScreen";
import HomeScreen from "./Home";
import ChairScreen from "./Chair";
import SofaScreen from "./Sofa";
import TVStandScreen from "./TVStand";

export type Screen =
  | "loading"
  | "home"
  | "shopfur"
  | "ar"
  | "cart"
  | "chair"
  | "sofa"
  | "tvstand"
  | "profile"
  | "inbox";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const App = () => {
  const [screen, setScreen] = useState<Screen>("loading");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...newItem, quantity: 1 }];
      }
    });
  };

  const incrementItem = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (screen === "loading")
    return <LoadingScreen onDone={() => setScreen("home")} />;

  if (screen === "home")
    return (
      <HomeScreen
        onCart={() => setScreen("cart")}
        onEnterShop={() => setScreen("shopfur")}
        goToScreen={setScreen}
      />
    );

  if (screen === "shopfur")
    return (
      <ShopfurScreen
        home={() => setScreen("home")}
        onAR={() => setScreen("ar")}
        onCart={() => setScreen("cart")}
        addToCart={() =>
          addToCart({ id: 1, name: "Chair", price: 299, quantity: 1 })
        }
      />
    );

  if (screen === "cart")
    return (
      <CartScreen
        cartItems={cartItems}
        onBack={() => setScreen("shopfur")}
        onIncrement={incrementItem}
        onRemove={removeItem}
        total={totalPrice()}
      />
    );

  if (screen === "ar") return <ARScene />;

  if (screen === "chair")
    return (
      <ChairScreen goBack={() => setScreen("home")} goToScreen={setScreen} />
    );
  if (screen === "sofa")
    return (
      <SofaScreen goBack={() => setScreen("home")} goToScreen={setScreen} />
    );
  if (screen === "tvstand")
    return (
      <TVStandScreen goBack={() => setScreen("home")} goToScreen={setScreen} />
    );

  if (screen === "profile") return <HomeScreen goToScreen={setScreen} />; // placeholder for profile
  if (screen === "inbox") return <HomeScreen goToScreen={setScreen} />; // placeholder for inbox

  return null;
};

export default App;
