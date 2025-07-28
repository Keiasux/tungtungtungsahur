import {
  ViroARScene,
  ViroARSceneNavigator,
  Viro3DObject,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroARPlaneSelector,
  ViroBox,
  ViroMaterials,
  ViroSpotLight,
  ViroQuad,
  ViroNode,
} from "@reactvision/react-viro";
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Animated } from "react-native";

interface ARSceneProps {
  uri: string;
  goBack: () => void;
}

interface HelloWorldSceneARProps {
  uri: string;
}

interface HelloWorldSceneARState {
  position: [number, number, number];
  animatedY: Animated.Value;
  animatedScale: Animated.Value;
  scale: [number, number, number];
  rotation: [number, number, number];
  lastPinchScale: number;
  lastRotationY: number;
}

ViroMaterials.createMaterials({
  greenBox: { diffuseColor: "#00ff00" },
  redBox: { diffuseColor: "#ff3333" },
  fakeShadow: {
    lightingModel: "Lambert",
    diffuseTexture: require("../assets/Shadow.png"),
  },
});

class HelloWorldSceneAR extends Component<
  HelloWorldSceneARProps,
  HelloWorldSceneARState
> {
  constructor(props: HelloWorldSceneARProps) {
    super(props);
    this.state = {
      position: [0, -1, -3.5],
      animatedY: new Animated.Value(-1),
      animatedScale: new Animated.Value(1),
      scale: [0.4, 0.4, 0.4],
      rotation: [0, 0, 0],
      lastPinchScale: 0.4,
      lastRotationY: 0,
    };
  }

  onPinch = (pinchState: number, scaleFactor: number) => {
    if (pinchState === 3) {
      this.setState(prev => ({ lastPinchScale: prev.scale[0] }));
      return;
    }
    const newScale = Math.min(Math.max(this.state.lastPinchScale * scaleFactor, 0.2), 3.0);
    this.setState({ scale: [newScale, newScale, newScale] });
  };

  onRotate = (rotateState: number, rotationFactor: number) => {
    if (rotateState === 3) {
      this.setState(prev => ({ lastRotationY: prev.rotation[1] }));
      return;
    }
    const newRotationY = this.state.lastRotationY + rotationFactor;
    this.setState({ rotation: [0, newRotationY, 0] });
  };

  onDrag = (newPosition: [number, number, number]) => {
    this.setState({ position: newPosition });

    Animated.spring(this.state.animatedY, {
      toValue: newPosition[1],
      useNativeDriver: false,
      friction: 5,
      tension: 40,
    }).start();

    // Pulse effect
    Animated.sequence([
      Animated.timing(this.state.animatedScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.animatedScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  getBoundaryMaterial = () => {
    const y = this.state.position[1];
    return y >= -1.4 && y <= -0.6 ? "greenBox" : "redBox";
  };

  render() {
    const { uri } = this.props;
    const { position, animatedY, animatedScale, scale, rotation } = this.state;




    return (
      <ViroARScene>
        <ViroAmbientLight color="#ffffff" intensity={300} />
        <ViroDirectionalLight
          color="#ffffff"
          direction={[-1, -1, -0.5]}
          intensity={600}
          castsShadow={true}
        />
        <ViroSpotLight
          innerAngle={5}
          outerAngle={90}
          direction={[0, -1, 0]}
          position={[0, 3, 0]}
          color="#ffffff"
          intensity={800}
          castsShadow={true}
        />

        <ViroARPlaneSelector>
          <ViroNode
            position={[
              position[0],
              animatedY as unknown as number, // keep smooth Y animation
              position[2],
            ]}
            rotation={rotation}
          >
            {/* Fake shadow */}
            <ViroQuad
              rotation={[-90, 0, 0]}
              width={1.5}
              height={1.5}
              position={[0, -0.01, 0]}
              materials={["fakeShadow"]}
              opacity={0.5}
              lightReceivingBitMask={3}
              shadowCastingBitMask={2}
            />
            {/* Placement indicator always visible */}
            <ViroBox
              position={[0, 0, 0]}
              scale={[0.3, 0.01, 0.3]}
              materials={this.getBoundaryMaterial()}
              opacity={0.5}
            />
            {/* Furniture */}
            {uri ? (
              <Viro3DObject
                source={{ uri }}
                type="GLB"
                scale={scale}
                onPinch={this.onPinch}
                onRotate={this.onRotate}
                onDrag={this.onDrag}
                dragType="FixedToWorld"
              />
            ) : (
              <Text>Model URI missing.</Text>
            )}
          </ViroNode>
        </ViroARPlaneSelector>
      </ViroARScene>
    );
  }
}

export default function ARScene({ uri, goBack }: ARSceneProps) {
  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus
        initialScene={{ scene: () => <HelloWorldSceneAR uri={uri} /> }}
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
  container: { flex: 1, position: "relative" },
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
