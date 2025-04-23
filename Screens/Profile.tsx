import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { launchImageLibrary, launchCamera, ImagePickerResponse } from "react-native-image-picker";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../firebase/firebaseConfig";

interface ProfileProps {
  goToScreen?: (screen: string) => void;
  goBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ goToScreen, goBack }) => {
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editAddressVisible, setEditAddressVisible] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isPicModalVisible, setIsPicModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginModalVisible, setLoginModalVisible] = useState(false);  // New modal state
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfileData(userSnap.data());
          setProfilePic(userSnap.data().profilePic);
        }
      };
      fetchUserData();
    } else {
      setIsLoggedIn(false);
      setLoginModalVisible(true);  // Show the login modal when not logged in
    }
  }, [currentUser]);

  const chooseProfilePic = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        setProfilePic(response.assets[0].uri ?? null);
      }
    });
  };

  const takeProfilePic = () => {
    launchCamera({ mediaType: "photo", quality: 1 }, (response: ImagePickerResponse) => {
      if (response.assets && response.assets[0]) {
        setProfilePic(response.assets[0].uri ?? null);
      }
    });
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    const userRef = doc(firestore, "users", currentUser.uid);
    try {
      await updateDoc(userRef, {
        username: profileData.username,
        fullName: profileData.fullName,
        birthday: profileData.birthday,
        gender: profileData.gender,
        phoneNumber: profileData.phoneNumber,
        address: profileData.address,
        profilePic: profilePic ?? profileData.profilePic,
      });
      Alert.alert("Success", "Profile updated.");
      setEditProfileVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  const handleSaveAddress = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, { address: profileData.address });
      Alert.alert("Success", "Address updated.");
      setEditAddressVisible(false);
    } catch {
      Alert.alert("Error", "Failed to update address.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      goToScreen?.("home");
    } catch {
      Alert.alert("Error", "Failed to log out.");
    }
  };

  const handleLogin = () => {
    setLoginModalVisible(false);
    goToScreen?.("lreg"); // Go to login screen
  };
  const handleLoginNo = () => {
    setLoginModalVisible(false);
    goToScreen?.("home"); // Go to login screen
  };



  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Image source={require("../assets/cart_icon.png")} style={styles.logoImage} />
        <Text style={styles.headerIcon}>⚙️</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>My Profile</Text>

        <View style={styles.profileBox}>
          <TouchableOpacity style={styles.profileImagePlaceholder} onPress={() => setIsPicModalVisible(true)}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileInitial}>{profileData?.username?.charAt(0)}</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.profileName}>{profileData?.username}</Text>
          <TouchableOpacity onPress={() => setEditProfileVisible(true)}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileDetails}>
          <Text style={styles.detailLabel}>Full Name</Text>
          <Text style={styles.detailValue}>{profileData?.fullName}</Text>

          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{currentUser?.email}</Text>

          <Text style={styles.detailLabel}>Birthday</Text>
          <Text style={styles.detailValue}>{profileData?.birthday}</Text>

          <Text style={styles.detailLabel}>Gender</Text>
          <Text style={styles.detailValue}>{profileData?.gender}</Text>

          <Text style={styles.detailLabel}>Phone Number</Text>
          <Text style={styles.detailValue}>{profileData?.phoneNumber}</Text>


          <Text style={styles.detailLabel}>Address</Text>
          <Text style={styles.detailValue}>{profileData?.address}</Text>
          <TouchableOpacity onPress={() => setEditAddressVisible(true)}>
            <Text style={styles.editAddressText}>Edit Address</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
      </View>
      {/* Modal: Login Prompt */}
      <Modal visible={loginModalVisible} transparent animationType="fade" onRequestClose={() => setLoginModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>You are not Logged in.</Text>
            <Text style={styles.modalText}>Do you want to Login to your Account or Create an Account?</Text>
            <View style={styles.modalButtons}>
            <TouchableOpacity onPress={(handleLoginNo)} style={styles.modalButtonCancel}>
                <Text style={styles.modalCancelText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogin} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
      {/* Modal: Choose Profile Picture */}
      <Modal visible={isPicModalVisible} transparent animationType="fade" onRequestClose={() => setIsPicModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Choose Profile Picture</Text>
            <TouchableOpacity style={styles.uploadPicButton} onPress={chooseProfilePic}>
              <Text style={styles.uploadPicText}>Upload Pic</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadPicButton} onPress={takeProfilePic}>
              <Text style={styles.uploadPicText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsPicModalVisible(false)} style={styles.modalButtonCancel}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal: Edit Profile */}
      <Modal visible={editProfileVisible} transparent animationType="fade" onRequestClose={() => setEditProfileVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput style={styles.input} value={profileData?.username} onChangeText={(text) => setProfileData({ ...profileData, username: text })} placeholder="Username" />
            <TextInput style={[styles.input, { backgroundColor: "#E0E0E0" }]} value={currentUser?.email ?? ""} editable={false} placeholder="Email" />
            <TextInput style={styles.input} value={profileData?.fullName} onChangeText={(text) => setProfileData({ ...profileData, fullName: text })} placeholder="Full Name" />
            <TextInput style={styles.input} value={profileData?.birthday} onChangeText={(text) => setProfileData({ ...profileData, birthday: text })} placeholder="Birthday" />
            <TextInput style={styles.input} value={profileData?.gender} onChangeText={(text) => setProfileData({ ...profileData, gender: text })} placeholder="Gender" />
            <TextInput style={styles.input} value={profileData?.phoneNumber} onChangeText={(text) => setProfileData({ ...profileData, phoneNumber: text })} placeholder="Phone Number" keyboardType="phone-pad" />
            <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setEditProfileVisible(false)} style={styles.modalButtonCancel}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveProfile} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Edit Address */}
      <Modal visible={editAddressVisible} transparent animationType="fade" onRequestClose={() => setEditAddressVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Address</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              value={profileData?.address}
              onChangeText={(text) => setProfileData({ ...profileData, address: text })}
              placeholder="Address"
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
            <TouchableOpacity onPress={() => setEditAddressVisible(false)} style={styles.modalButtonCancel}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveAddress} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D8C5B4", // soft cream background
  },
  header: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    color: "white",
    fontSize: 24,
  },
  logoImage: {
    width: 40, height: 40, marginRight: 5
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#3E2E22",
    marginBottom: 20,
  },
  profileBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#D6C7B0",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  profileInitial: {
    fontSize: 40,
    color: "#fff",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3E2E22",
    marginTop: 10,
  },
  editButton: {
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 16,
    color: "#A67B5B", // button accent
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  actionButton: {
    padding: 10,
    backgroundColor: "#D6C7B0",
    borderRadius: 8,
  },
  actionText: {
    fontSize: 16,
    color: "#3E2E22",
  },
  profileDetails: {
    marginTop: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3E2E22",
  },
  detailValue: {
    fontSize: 14,
    marginBottom: 10,
    color: "#6B4F3B",
  },
  editAddressButton: {
    marginBottom: 10,
  },
  editAddressText: {
    fontSize: 16,
    color: "#A67B5B",
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6B4F3B",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  bottomNav: {
    backgroundColor: "#3E2E22",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  navItem: { alignItems: "center" },
  navIcon: { color: "white", fontSize: 22 },
  navLabel: { color: "white", fontSize: 12, marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
    color: "#3E2E22",
    textAlign: "center",
  },
  uploadPicButton: {
    padding: 10,
    backgroundColor: "#D6C7B0",
    borderRadius: 6,
    marginTop: 10,
  },
  uploadPicText: {
    textAlign: "center",
    color: "#3E2E22",
  },
  modalButtonCancel: {
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    backgroundColor: "#ccc",
    marginRight: 5,
  },
  modalCancelText: {
    textAlign: "center",
    color: "#fff",
    minWidth: 60
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#6B4F3B",
    padding: 10,
    borderRadius: 6,
    marginRight: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#6B4F3B",
    marginBottom: 0,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D6C7B0",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    color: "#3E2E22",
  },
  addressInput: {
    height: 100,
    textAlignVertical: "top", // this ensures the text starts at the top
  },
  
});