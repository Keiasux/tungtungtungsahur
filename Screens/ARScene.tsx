import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroTrackingReason,
} from "@reactvision/react-viro";
import React, { useState, useRef } from "react";
import { StyleSheet } from "react-native";

const HelloWorldSceneAR = () => {
  const modelUri =
    "https://raw.githubusercontent.com/Jerohm-1003/glb-models/main/furniture.glb";

  const [scale, setScale] = useState<[number, number, number]>([0.3, 0.3, 0.3]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [position, setPosition] = useState<[number, number, number]>([
    0, -1, -2,
  ]);

  const lastScale = useRef(scale[0]);
  const lastRotation = useRef(rotation[1]);

  const onInitialized = (state: any, reason: ViroTrackingReason) => {
    console.log("Tracking initialized:", state, reason);
  };

  const onPinch = (pinchState: number, scaleFactor: number, source: any) => {
    if (pinchState === 3) {
      lastScale.current = scale[0];
      return;
    }

    const newScale = Math.min(
      Math.max(lastScale.current * scaleFactor, 0.2),
      3.0
    );
    setScale([newScale, newScale, newScale]);
  };

  const onRotate = (
    rotateState: number,
    rotationFactor: number,
    source: any
  ) => {
    if (rotateState === 3) {
      lastRotation.current = rotation[1];
      return;
    }
    setRotation([0, lastRotation.current + rotationFactor, 0]);
  };

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroAmbientLight color="#FFFFFF" intensity={500} />

      <Viro3DObject
        key={"glb-model"} // <-- important to force refresh on change
        source={{ uri: modelUri }}
        position={position}
        scale={scale}
        rotation={rotation}
        type="GLB"
        onPinch={onPinch}
        onRotate={onRotate}
        dragType="FixedDistance"
        onDrag={(newPos) => setPosition(newPos)}
      />
    </ViroARScene>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{ scene: HelloWorldSceneAR }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1 },
});
