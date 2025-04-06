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

  const BAR_WIDTH = 300;
  const ICON_SIZE = 30;

  // Cart icon travels across the bar
  const iconTranslateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH - ICON_SIZE],
  });

  // Bar width = icon's current X position
  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH - ICON_SIZE],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.progressBarContainer, { width: BAR_WIDTH }]}>
        {/* Progress bar that grows behind the cart */}
        <Animated.View style={[styles.progressBar, { width: barWidth }]} />

        {/* Cart icon that leads the progress */}
        <Animated.Image
          source={require("../assets/cart_icon.png")}
          style={[
            styles.cartIcon,
            {
              transform: [{ translateX: iconTranslateX }],
            },
          ]}
          resizeMode="contain"
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
    height: 20,
    backgroundColor: "#F5E8D6",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4D3B30",
    position: "absolute",
    left: 0,
    top: 0,
  },
  cartIcon: {
    width: 30,
    height: 30,
    position: "absolute",
    top: -5,
    left: 0,
  },
});

export default LoadingScreen;
