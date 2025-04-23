import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";

interface Props {
  onFinish: () => void;
}

const steps = [
  {
    title: "Visualize Before You Buy",
    text: "Experience furniture in your space using AR view. Shop smarter with confidence and style.",
    image: require("../assets/cart_icon.png"),
  },
  {
    title: "Try it in AR",
    text: "Visualize items in your space before you buy. No more surprises!",
    image: require("../assets/cart_icon.png"),
  },
  {
    title: "Visualize Before You Buy",
    text: "Experience furniture in your space using AR view. Shop smarter with confidence and style.",
    image: require("../assets/cart_icon.png"),
  },
];

const NewlyUinfo: React.FC<Props> = ({ onFinish }) => {
  const [step, setStep] = useState<number>(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const next = () => {
    if (step < steps.length - 1) {
      fadeAnim.setValue(0); // Reset fade
      setStep((prev) => prev + 1);
    } else {
      onFinish();
    }
  };

  const { title, text, image } = steps[step];

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalBox, { opacity: fadeAnim }]}>
          <Image source={image} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
          <TouchableOpacity style={styles.button} onPress={next}>
            <Text style={styles.buttonText}>{step < 2 ? "Next" : "Start"}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default NewlyUinfo;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#FFF8F0",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#3E2E22",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#6B4F3B",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#C2A87B",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
});