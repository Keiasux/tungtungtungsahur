// UnityARScene.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import UnityView from "react-native-unity-view";

interface UnityARSceneProps {
  goBack: () => void;
}

export default function UnityARScene({ goBack }: UnityARSceneProps) {
  return (
    <View style={{ flex: 1 }}>
      <UnityView style={{ flex: 1 }} />
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#00000080",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: { color: "#fff", fontSize: 16 },
});
