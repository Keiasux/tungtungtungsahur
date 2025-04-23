import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroARPlaneSelector,
  ViroBox,
  ViroMaterials,
} from "@reactvision/react-viro";
import React, { Component, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

interface ARSceneProps {
  uri: string;
  goBack: () => void;
}

interface HelloWorldSceneARProps {
  uri: string;
}

interface HelloWorldSceneARState {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  lastPinchScale: number;
  lastRotationY: number;
}

// ✅ REGISTER MATERIALS AT TOP (ONCE)
ViroMaterials.createMaterials({
  greenBox: {
    diffuseColor: "#00ff00",
  },
  redBox: {
    diffuseColor: "#ff3333",
  },
});

class HelloWorldSceneAR extends Component<
  HelloWorldSceneARProps,
  HelloWorldSceneARState
> {
  constructor(props: HelloWorldSceneARProps) {
    super(props);
    this.state = {
      position: [0, -1, -2], // Center in front of user
      scale: [0.3, 0.3, 0.3],
      rotation: [0, 0, 0],
      lastPinchScale: 0.3,
      lastRotationY: 0,
    };
  }

  onPinch = (pinchState: number, scaleFactor: number) => {
    if (pinchState === 3) {
      this.setState((prev) => ({
        lastPinchScale: prev.scale[0],
      }));
      return;
    }

    const newScale = Math.min(
      Math.max(this.state.lastPinchScale * scaleFactor, 0.2),
      3.0
    );
    this.setState({ scale: [newScale, newScale, newScale] });
  };

  onRotate = (rotateState: number, rotationFactor: number) => {
    if (rotateState === 3) {
      this.setState((prev) => ({
        lastRotationY: prev.rotation[1],
      }));
      return;
    }

    const newRotationY = this.state.lastRotationY + rotationFactor;
    this.setState({ rotation: [0, newRotationY, 0] });
  };

  onDrag = (newPosition: [number, number, number]) => {
    this.setState({ position: newPosition });
  };

  onDoubleTap = () => {
    this.setState({
      position: [0, -1, -2],
      rotation: [0, 0, 0],
      scale: [0.3, 0.3, 0.3],
      lastRotationY: 0,
      lastPinchScale: 0.3,
    });
  };

  getBoundaryMaterial = () => {
    const y = this.state.position[1];
    return y >= -1.4 && y <= -0.6 ? "greenBox" : "redBox";
  };

  render() {
    return (
      <ViroARScene>
        <ViroAmbientLight color="#FFFFFF" intensity={500} />

        <ViroARPlaneSelector />

        {/* Bounding Box Indicator */}
        <ViroBox
          position={this.state.position}
          scale={[0.3, 0.01, 0.3]}
          materials={this.getBoundaryMaterial()}
          opacity={0.6}
        />

        {/* Always visible model */}
        <Viro3DObject
          source={{ uri: this.props.uri }}
          type="GLB"
          position={this.state.position}
          scale={this.state.scale}
          rotation={this.state.rotation}
          onPinch={this.onPinch}
          onRotate={this.onRotate}
          onDrag={this.onDrag}
          onClick={this.onDoubleTap}
          dragType="FixedToWorld"
        />
      </ViroARScene>
    );
  }
}

export default function ARScene({ uri, goBack }: ARSceneProps) {
  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus
        initialScene={{
          scene: () => <HelloWorldSceneAR uri={uri} />,
        }}
        viroAppProps={{ uri }}
        style={styles.f1}
      />
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  f1: { flex: 1 },
  container: {
    flex: 1,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#00000080",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});