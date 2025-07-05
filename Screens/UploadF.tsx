import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebaseConfig"; // ✅ Use initialized db/auth here
import type { Screen } from "./App"; // Adjust path if needed

interface FurnitureData {
  name: string;
  price: string;
  description: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  category: string;
  glbFileName: string;
  imageUris: string[];
}

interface FurnitureUploadScreenProps {
  goBack: () => void;
  goToScreen: (screen: Screen, params?: any) => void;
}

const FurnitureUploadScreen: React.FC<FurnitureUploadScreenProps> = ({
  goBack,
  goToScreen,
}) => {
  const [furnitureData, setFurnitureData] = useState<FurnitureData>({
    name: "",
    price: "",
    description: "",
    dimensions: { length: "", width: "", height: "" },
    category: "",
    glbFileName: "",
    imageUris: [],
  });

  const mockPickGLBFile = () => {
    setFurnitureData({ ...furnitureData, glbFileName: "mock_model.glb" });
    Alert.alert("Mock", "GLB file selected (mock).");
  };

  const mockPickImages = () => {
    const mockUri = "https://via.placeholder.com/100";
    setFurnitureData({ ...furnitureData, imageUris: [mockUri, mockUri] });
    Alert.alert("Mock", "Images selected (mock).");
  };

  const submitFurniture = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "You must be logged in to submit furniture.");
      return;
    }

    const {
      name,
      price,
      description,
      dimensions,
      category,
      glbFileName,
      imageUris,
    } = furnitureData;

    if (
      !name ||
      !price ||
      !description ||
      !category ||
      !glbFileName ||
      imageUris.length === 0
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(firestore, "products"), {
        ...furnitureData,
        price: parseFloat(price),
        status: "pending",
        uploader: user.uid,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Furniture submitted for review.");
      setFurnitureData({
        name: "",
        price: "",
        description: "",
        dimensions: { length: "", width: "", height: "" },
        category: "",
        glbFileName: "",
        imageUris: [],
      });
    } catch (error) {
      Alert.alert("Upload Failed", "Please try again later.");
      console.error("Error uploading furniture:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goToScreen("home")}>
          <Text style={styles.headerIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Upload Furniture</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={furnitureData.name}
        onChangeText={(text) =>
          setFurnitureData({ ...furnitureData, name: text })
        }
        placeholder="Enter furniture name"
        style={styles.input}
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Price</Text>
      <TextInput
        keyboardType="numeric"
        value={furnitureData.price}
        onChangeText={(text) =>
          setFurnitureData({ ...furnitureData, price: text })
        }
        placeholder="Enter price"
        style={styles.input}
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        multiline
        numberOfLines={4}
        value={furnitureData.description}
        onChangeText={(text) =>
          setFurnitureData({ ...furnitureData, description: text })
        }
        placeholder="Enter description"
        style={[styles.input, { height: 100 }]}
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Dimensions (L x W x H)</Text>
      <View style={styles.dimensionsRow}>
        {["length", "width", "height"].map((dim) => (
          <TextInput
            key={dim}
            placeholder={dim.charAt(0).toUpperCase() + dim.slice(1)}
            keyboardType="numeric"
            value={
              furnitureData.dimensions[
                dim as keyof typeof furnitureData.dimensions
              ]
            }
            onChangeText={(text) =>
              setFurnitureData({
                ...furnitureData,
                dimensions: { ...furnitureData.dimensions, [dim]: text },
              })
            }
            style={styles.dimensionInput}
            placeholderTextColor="#888"
          />
        ))}
      </View>

      <Text style={styles.label}>Category</Text>
      <TextInput
        value={furnitureData.category}
        onChangeText={(text) =>
          setFurnitureData({ ...furnitureData, category: text })
        }
        placeholder="Enter category (e.g., Sofa, Table)"
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        onPress={mockPickGLBFile}
        style={[styles.button, { backgroundColor: "#705D47" }]}
      >
        <Text style={styles.buttonText}>Mock Upload GLB File</Text>
      </TouchableOpacity>
      <Text style={styles.subText}>
        {furnitureData.glbFileName || "No file selected"}
      </Text>

      <TouchableOpacity
        onPress={mockPickImages}
        style={[styles.button, { backgroundColor: "#8D6E53" }]}
      >
        <Text style={styles.buttonText}>Mock Pick Images</Text>
      </TouchableOpacity>

      <ScrollView horizontal style={{ marginTop: 10 }}>
        {furnitureData.imageUris.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: 100, height: 100, marginRight: 10 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#3E2E22", marginTop: 20 }]}
        onPress={submitFurniture}
      >
        <Text style={styles.buttonText}>Submit Furniture</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#A89580", flexGrow: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#3E2E22",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backButtonText: { color: "white", fontWeight: "600" },
  headerIcon: { fontSize: 24, color: "#3E2E22" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3E2E22",
    marginBottom: 20,
  },
  label: { color: "#3E2E22", marginBottom: 4, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#705D47",
    backgroundColor: "#F2EDE6",
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    color: "#3E2E22",
  },
  dimensionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dimensionInput: {
    borderWidth: 1,
    borderColor: "#705D47",
    backgroundColor: "#F2EDE6",
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 6,
    color: "#3E2E22",
  },
  button: { padding: 12, alignItems: "center", borderRadius: 8, marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold" },
  subText: { color: "#3E2E22", marginBottom: 10 },
});

export default FurnitureUploadScreen;
