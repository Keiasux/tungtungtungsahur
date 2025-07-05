import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { auth, firestore } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Screen } from "./App";

interface Props {
  goToScreen: (screen: Screen, params?: any) => void;
}

const LRegScreen: React.FC<Props> = ({ goToScreen }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "63848347199-7h2faq8cgudfvd4iv9bggeon73egoj8h.apps.googleusercontent.com",
    });
  }, []);

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password),
      upperLower: /(?=.*[a-z])(?=.*[A-Z])/.test(password),
    };
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      if (isRegister) {
        const reqs = validatePassword(form.password);
        if (!reqs.length || !reqs.number || !reqs.special || !reqs.upperLower) {
          Alert.alert("Error", "Password does not meet requirements.");
          return;
        }
        if (form.password !== form.confirm) {
          Alert.alert("Error", "Passwords do not match.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const user = userCredential.user;

        await setDoc(doc(firestore, "users", user.uid), {
          username: form.username,
          email: form.email,
          role: "user", // default role
        });

        Alert.alert("Success", "Account created.");
        goToScreen("profileSetup", { uid: user.uid, email: user.email });
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );
        const user = userCredential.user;

        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists()) {
          Alert.alert("Error", "No user record found in Firestore.");
          return;
        }

        const userData = userDoc.data();
        const role = userData?.role?.toLowerCase?.() || "user";

        // console.log("Logged in as role:", role);

        Alert.alert("Success", "Logged in.");
        if (role === "admin") {
          goToScreen("adminDashb"); // ✅ fixed spelling
        } else {
          goToScreen("home");
        }
      }
    } catch (error: any) {
      Alert.alert("Firebase Error", error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      const googleCredential = GoogleAuthProvider.credential(idToken);

      const userCredential = await signInWithCredential(auth, googleCredential);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      const userData = userDoc.data();
      const role = userData?.role?.toLowerCase?.() || "user";

      // console.log("Google login as role:", role);

      Alert.alert("Success", "Logged in with Google.");
      if (role === "admin") {
        goToScreen("adminDashb"); // ✅ fixed spelling
      } else {
        goToScreen("home");
      }
    } catch (error: any) {
      Alert.alert("Google Sign-In Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => goToScreen("home")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>

      {isRegister && (
        <>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={form.username}
            onChangeText={(text) => setForm({ ...form, username: text })}
          />
        </>
      )}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />

      {isRegister && (
        <>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            secureTextEntry
            value={form.confirm}
            onChangeText={(text) => setForm({ ...form, confirm: text })}
          />
          <View style={styles.reqs}>
            {Object.entries(validatePassword(form.password)).map(([key, met]) =>
              !met ? (
                <Text key={key} style={styles.requirement}>
                  - Must contain{" "}
                  {key === "upperLower" ? "uppercase & lowercase" : key}
                </Text>
              ) : null
            )}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isRegister ? "Register" : "Login"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#db4437" }]}
        onPress={handleGoogleLogin}
      >
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister((prev) => !prev)}>
        <Text style={styles.toggleText}>
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LRegScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    justifyContent: "center",
    backgroundColor: "#F5F5DC",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#3E2723",
  },
  input: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: "#3E2723",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#5D4037",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  toggleText: {
    marginTop: 15,
    textAlign: "center",
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
  requirement: {
    color: "red",
    fontSize: 12,
  },
  reqs: {
    marginTop: 5,
    paddingLeft: 5,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: "#1E90FF",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3E2723",
    marginBottom: 4,
    marginTop: 12,
  },
});
