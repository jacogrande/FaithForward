import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { auth } from "@root/firebase";
import { Container } from "@src/components/Container";
import DeleteAccountModal from "@src/components/DeleteAccountModal";
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from "@src/constants";
import useStore from "@src/Store";
import colors from "@src/styles/colors";
import * as MailComposer from "expo-mail-composer";
import { onIdTokenChanged } from "firebase/auth";
import React, { useState } from "react";
import {
  Button,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  return (
    <Container>
      <View style={styles.container}>
        {getPageContents()}
        <Policies />
      </View>
    </Container>
  );
};

const Policies = () => {
  const { setError } = useStore();

  const goToPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY_URL);
  };

  const goToTermsOfService = () => {
    Linking.openURL(TERMS_OF_SERVICE_URL);
  };

  const contactSupport = async () => {
    try {
      await MailComposer.composeAsync({
        recipients: ["hello.faith.forward@gmail.com"],
        subject: "Support ticket for Faith Forward",
        body: "",
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
    <View style={styles.policies}>
      <TouchableOpacity
        style={styles.policyLinkContainer}
        onPress={contactSupport}
      >
        <FontAwesome5
          name="envelope"
          size={20}
          color={colors.black}
          style={styles.policyIcon}
        />
        <Text style={styles.policyLink}>Contact Support</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.policyLinkContainer}
        onPress={goToPrivacyPolicy}
      >
        <FontAwesome5
          name="lock"
          size={20}
          color={colors.black}
          style={styles.policyIcon}
        />
        <Text style={styles.policyLink}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.policyLinkContainer}
        onPress={goToTermsOfService}
      >
        <FontAwesome5
          name="file-alt"
          size={20}
          color={colors.black}
          style={styles.policyIcon}
        />
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
    justifyContent: "flex-end",
  },
  policyLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  policyIcon: {
    width: 24,
    textAlign: "center",
  },
  policyLink: {
    fontSize: 14,
    marginLeft: 8,
    color: colors.black,
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
