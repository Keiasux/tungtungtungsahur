import React, { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import ARScene from "./ARScene";
import CartScreen from "./CartScreen";
import HomeScreen from "./Home";
import FurnitureScreen from "./FurnitureScreen";
import LivingRoomScreen from "./LRf";
import BRoomScreen from "./BRf";
import DRoomScreen from "./Dr";
import ShopfurScreen from "./FURARd";
import BRoomtScreen from "./BRFt";
import DRoomtScreen from "./Drt";

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
  | "inbox"
  | "furniture"
  | "livingroom"
  | "bedroom"
  | "diningroom"
  | "Desks"
  | "Wardrobe"
  | "Bed"
  | "DiningTable"
  | "Cabinet"
  | "DiningChair"
  | "broomt"
  | "droomt";

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

  if (["chair", "sofa", "tvstand"].includes(screen))
    return (
      <ShopfurScreen
        category={screen as "chair" | "sofa" | "tvstand"}
        goToScreen={setScreen}
        addToCart={(item) => addToCart({ ...item, quantity: 1 })}
        onAR={() => setScreen("ar")}
      />
    );

  if (screen === "cart")
    return (
      <CartScreen
        cartItems={cartItems}
        onBack={() => setScreen("home")}
        onIncrement={incrementItem}
        onRemove={removeItem}
        total={totalPrice()}
      />
    );

  if (screen === "ar") return <ARScene />;

  if (screen === "furniture")
    return (
      <FurnitureScreen
        goBack={() => setScreen("home")}
        goToScreen={setScreen}
      />
    );

  if (screen === "livingroom")
    return (
      <LivingRoomScreen
        goBack={() => setScreen("furniture")}
        goToScreen={setScreen}
      />
    );

  if (screen === "broomt")
    return (
      <BRoomtScreen
        goBack={() => setScreen("furniture")}
        goToScreen={setScreen}
      />
    );

  if (screen === "droomt")
    return (
      <DRoomtScreen
        goBack={() => setScreen("furniture")}
        goToScreen={setScreen}
      />
    );

  if (["Desks", "Wardrobe", "Bed"].includes(screen))
    return (
      <BRoomScreen
        category={screen as "Desks" | "Wardrobe" | "Bed"}
        goToScreen={setScreen}
        addToCart={(item) => addToCart({ ...item, quantity: 1 })}
        onAR={() => setScreen("ar")}
      />
    );

  if (["DiningChair", "Cabinet", "DiningTable"].includes(screen))
    return (
      <DRoomScreen
        category={screen as "DiningChair" | "Cabinet" | "DiningTable"}
        goToScreen={setScreen}
        addToCart={(item) => addToCart({ ...item, quantity: 1 })}
        onAR={() => setScreen("ar")}
      />
    );

  if (screen === "profile") return <HomeScreen goToScreen={setScreen} />;
  if (screen === "inbox") return <HomeScreen goToScreen={setScreen} />;

  return null;
};

export default App;
