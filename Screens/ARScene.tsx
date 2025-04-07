import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
} from "@reactvision/react-viro";
import React, { Component } from "react";
import { StyleSheet } from "react-native";

interface ARSceneProps {
  uri: string;
  goBack: () => void;
}

class HelloWorldSceneAR extends Component<{ uri: string }> {
  state: {
    scale: [number, number, number];
    rotation: [number, number, number];
    position: [number, number, number];
  } = {
    scale: [0.3, 0.3, 0.3],
    rotation: [0, 0, 0],
    position: [0, -1, -2],
  };

  lastScale = this.state.scale[0];
  lastRotation = this.state.rotation[1];

  onPinch = (pinchState: number, scaleFactor: number) => {
    if (pinchState === 3) {
      this.lastScale = this.state.scale[0];
      return;
    }
    const newVal = Math.min(Math.max(this.lastScale * scaleFactor, 0.2), 3.0);
    this.setState({ scale: [newVal, newVal, newVal] });
  };

  onRotate = (rotateState: number, rotationFactor: number) => {
    if (rotateState === 3) {
      this.lastRotation = this.state.rotation[1];
      return;
    }
    this.setState({ rotation: [0, this.lastRotation + rotationFactor, 0] });
  };

  render() {
    return (
      <ViroARScene>
        <ViroAmbientLight color="#FFFFFF" intensity={500} />
        <Viro3DObject
          source={{ uri: this.props.uri }}
          type="GLB"
          position={[...this.state.position] as [number, number, number]}
          scale={[...this.state.scale] as [number, number, number]}
          rotation={[...this.state.rotation] as [number, number, number]}
          onPinch={this.onPinch}
          onRotate={this.onRotate}
          dragType="FixedDistance"
          onDrag={(newPos) =>
            this.setState({ position: newPos as [number, number, number] })
          }
        />
      </ViroARScene>
    );
  }
}

export default function ARScene({ uri }: ARSceneProps) {
  return (
    <ViroARSceneNavigator
      autofocus
      initialScene={{ scene: () => <HelloWorldSceneAR uri={uri} /> }}
      viroAppProps={{ uri }}
      style={styles.f1}
    />
  );
}

const styles = StyleSheet.create({
  f1: { flex: 1 },
});
