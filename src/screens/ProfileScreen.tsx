import React from "react";
import {
  Button,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebase";
import DeleteAccountModal from "../components/DeleteAccountModal";
import colors from "../styles/colors";

const PRIVACY_POLICY_URL =
  "https://www.github.com/jacogrande/FaithForward/blob/master/privacy-policy.md";
const TERMS_OF_SERVICE_URL =
  "https://www.github.com/jacogrande/FaithForward/blob/master/terms-of-service.md";

// TODO: Unstub account level
const ProfileScreen: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const closeModal = () => setIsModalVisible(false);
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Profile</Text>
        <Text style={styles.heading}>Email</Text>
        <Text style={styles.text}>{auth.currentUser?.email}</Text>
        <Text style={styles.heading}>Account Level</Text>
        <Text style={styles.text}>Free</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <Button
        color={colors.red}
        onPress={() => setIsModalVisible(true)}
        title="Delete Account"
      />
      <DeleteAccountModal
        isModalVisible={isModalVisible}
        onClose={closeModal}
      />
      <Policies />
    </View>
  );
};

const Policies = () => {
  const goToPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY_URL);
  };

  const goToTermsOfService = () => {
    Linking.openURL(TERMS_OF_SERVICE_URL);
  };

  return (
    <View style={styles.policies}>
      <TouchableOpacity onPress={goToPrivacyPolicy}>
        <Text style={styles.policyLink}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToTermsOfService}>
        <Text style={styles.policyLink}>Terms of Service</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    textAlign: "left",
    backgroundColor: colors.paper,
    paddingTop: 80,
  },
  policies: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  policyLink: {
    fontSize: 12,
  },
  section: {
    marginBottom: 16,
    marginTop: 8,
  },
  header: {
    fontSize: 28,
    marginBottom: 16,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#777",
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 4,
    paddingVertical: 18,
    marginTop: 12,
    alignItems: "center",
    marginBottom: 24,
  },
});

export default ProfileScreen;
