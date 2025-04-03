import React, { useEffect, useState } from "react";
import { View, Image, Animated, StyleSheet } from "react-native";

interface LoadingScreenProps {
  onFinishLoading: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinishLoading }) => {
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => onFinishLoading());
  }, [onFinishLoading]);

  const progressInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "85%"], // Progress bar fills up
  });

  const cartPosition = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "85%"], // Cart moves along with progress
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        {/* Progress Bar */}
        <Animated.View
          style={[styles.progressBar, { width: progressInterpolation }]}
        />

        {/* Moving Cart Icon */}
        <Animated.Image
          source={require("../assets/cart_icon.png")}
          style={[styles.cartIcon, { left: cartPosition }]}
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
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4D3B30",
    position: "absolute",
    left: 0,
  },
  cartIcon: {
    width: 30,
    height: 30,
    position: "absolute",
  },
});

export default LoadingScreen;
