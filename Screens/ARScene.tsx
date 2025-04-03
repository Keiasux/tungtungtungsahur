import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

const HelloWorldSceneAR = () => {
  const modelUri =
    "https://raw.githubusercontent.com/Jerohm-1003/glb-models/main/furniture.glb";

  // Use explicit [number, number, number] tuple types
  const [scale, setScale] = useState<[number, number, number]>([0.5, 0.5, 0.5]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("onInitialized", state, reason);
  }

  // Pinch to zoom
  const onPinch = (pinchState: number, scaleFactor: number) => {
    if (pinchState === 3) return; // End of gesture
    setScale([scaleFactor, scaleFactor, scaleFactor]); // Ensure tuple format
  };

  // Rotate model
  const onRotate = (rotateState: number, rotationFactor: number) => {
    if (rotateState === 3) return; // End of gesture
    setRotation([0, rotation[1] + rotationFactor, 0]); // Ensure tuple format
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* Ambient Light */}
      <ViroAmbientLight color="#FFFFFF" intensity={500} />

      {/* Load the 3D Model with interactions */}
      <Viro3DObject
        source={{ uri: modelUri }}
        position={[0, -1, -2]}
        scale={scale} // Fixed type issue
        rotation={rotation} // Fixed type issue
        type="GLB"
        onPinch={onPinch} // Enable pinch to zoom
        onRotate={onRotate} // Enable rotation
        dragType="FixedToWorld" // Allow dragging in space
        onDrag={() => {}} // Enable dragging
      />
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1 },
});
