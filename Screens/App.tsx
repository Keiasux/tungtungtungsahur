import React, { useState } from "react";
import LoadingScreen from "./LoadingScreen";
import CartScreen from "./CartScreen";
import HomeScreen from "./Home";
import FurnitureScreen from "./FurnitureScreen";
import LivingRoomScreen from "./LRf";
import BRoomScreen from "./BRf";
import DRoomScreen from "./Dr";
import ShopfurScreen from "./FURARd";
import BRoomtScreen from "./BRFt";
import DRoomtScreen from "./Drt";
import ARScene from "./ARScene";
import DRScreen from "./Dr";
import BRScreen from "./BRf";

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
  const [arUri, setArUri] = useState<string>("");

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

  const goToScreen = (target: Screen, params?: any) => {
    if (target === "ar" && params?.uri) {
      setArUri(params.uri);
    }
    setScreen(target);
  };

  if (screen === "loading")
    return <LoadingScreen onDone={() => setScreen("home")} />;

  if (screen === "home")
    return (
      <HomeScreen
        onCart={() => setScreen("cart")}
        onEnterShop={() => setScreen("shopfur")}
        goToScreen={goToScreen}
      />
    );

  if (["chair", "sofa", "tvstand"].includes(screen))
    return (
      <ShopfurScreen
        category={screen as "chair" | "sofa" | "tvstand"}
        goToScreen={goToScreen}
        addToCart={(item) => addToCart({ ...item, quantity: 1 })}
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

  if (screen === "ar")
    return <ARScene uri={arUri} goBack={() => setScreen("home")} />;

  if (screen === "furniture")
    return (
      <FurnitureScreen
        goBack={() => setScreen("home")}
        goToScreen={goToScreen}
      />
    );

  if (screen === "livingroom")
    return (
      <LivingRoomScreen
        goBack={() => setScreen("furniture")}
        goToScreen={goToScreen}
      />
    );

  if (screen === "broomt")
    return (
      <BRoomtScreen
        goBack={() => setScreen("furniture")}
        goToScreen={goToScreen}
      />
    );

  if (screen === "droomt")
    return (
      <DRoomtScreen
        goBack={() => setScreen("furniture")}
        goToScreen={goToScreen}
      />
    );

  if (["Desks", "Wardrobe", "Bed"].includes(screen))
    return (
      <BRScreen
        category={screen as "Desks" | "Wardrobe" | "Bed"}
        goToScreen={goToScreen}
        addToCart={(item) => addToCart({ ...item, quantity: 1 })}
      />
    );

  if (["DiningChair", "Cabinet", "DiningTable"].includes(screen))
    return (
      <DRScreen
        category={screen as "DiningChair" | "Cabinet" | "DiningTable"}
        goToScreen={goToScreen}
        addToCart={(item) => addToCart({ ...item, quantity: 1 })}
      />
    );

  if (screen === "profile") return <HomeScreen goToScreen={goToScreen} />;
  if (screen === "inbox") return <HomeScreen goToScreen={goToScreen} />;

  return null;
};

export default App;
