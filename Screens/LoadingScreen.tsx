import React, { useEffect, useState } from "react";
import { View, Image, Animated, StyleSheet } from "react-native";

interface LoadingScreenProps {
  onDone: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onDone }) => {
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      onDone();
    });
  }, [onDone]);

  const progressInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "85%"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBar, { width: progressInterpolation }]}
        />
        <Image
          source={require("../assets/cart_icon.png")}
          style={styles.cartIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2C5B4",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarContainer: {
    width: "80%",
    height: 20,
    backgroundColor: "#F5E8D6",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4D3B30",
  },
  cartIcon: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 5,
  },
});

export default LoadingScreen;
