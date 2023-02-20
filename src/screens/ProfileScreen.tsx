import { useNavigation } from "@react-navigation/native";
import { Snackbar } from "react-native-paper";
import * as MailComposer from "expo-mail-composer";
import { StackNavigationProp } from "@react-navigation/stack";
import { onIdTokenChanged } from "firebase/auth";
import React, { useState } from "react";
import useStore from "../Store";
import {
  Button,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebase";
import { Container } from "../components/Container";
import DeleteAccountModal from "../components/DeleteAccountModal";
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from "../constants";
import colors from "../styles/colors";

// TODO: Add toggle for push notifications
const LoggedInProfile: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  return (
    <View>
      <Text style={styles.heading}>Email</Text>
      <Text style={styles.text}>{auth.currentUser?.email}</Text>
      <Text style={styles.heading}>Account Level</Text>
      <Text style={styles.text}>Free</Text>
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
    </View>
  );
};

const AnonymousProfile: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<{ "Sign Up": {} }>>();
  return (
    <View>
      <Text style={styles.text}>You don't have an account yet.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Sign Up", {})}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

// TODO: Unstub account level
const ProfileScreen: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { error, setError } = useStore();

  onIdTokenChanged(auth, (user) => {
    if (user?.isAnonymous) {
      setIsAnonymous(true);
    } else {
      setIsAnonymous(false);
    }
  });

  const getPageContents = () => {
    if (isAnonymous) {
      return <AnonymousProfile />;
    } else {
      return <LoggedInProfile />;
    }
  };

  // TODO: Autopopulate email body with device and user info
  const contactSupport = async () => {
    try {
      await MailComposer.composeAsync({
        recipients: ["hello.faith.forward@gmail.com"],
        subject: "Feedback for Faith Forward",
        body: "Hi Faith Forward Team,",
      });
    } catch (err: any) {
      console.error(err);
      if (err.message.includes("Mail services are not available")) {
        setError("Please sign in to your Mail app.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <Container>
      <View style={styles.container}>
        {getPageContents()}
        <TouchableOpacity style={styles.button} onPress={contactSupport}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
        <Policies />
      </View>
      <Snackbar
        visible={Boolean(error)}
        onDismiss={() => setError(null)}
        action={{
          label: "Dismiss",
          onPress: () => setError(null),
        }}
      >
        {error}
      </Snackbar>
    </Container>
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
  header: {
    fontSize: 28,
    marginBottom: 24,
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
    marginTop: 24,
    alignItems: "center",
    marginBottom: 24,
  },
});

export default ProfileScreen;
