import { auth, deletePushToken } from "@src/firebase";
import useStore from "@src/store";
import colors from "@src/styles/colors";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Snackbar } from "react-native-paper";

interface DeleteAccountModalProps {
  isModalVisible: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = (props) => {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { pushToken } = useStore();

  const signIn = async (): Promise<boolean> => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user?.email || "",
        password
      );
      await reauthenticateWithCredential(user!, credential);
      return true;
    } catch (err) {
      return false;
    }
  };

  const deleteAccount = async () => {
    Keyboard.dismiss();
    if (!auth.currentUser) {
      return props.onClose();
    }
    const signedIn = await signIn();
    if (!signedIn) return setError("Incorrect password. Try again.");

    try {
      await deleteUser(auth.currentUser);
      if (!!pushToken) {
        await deletePushToken(pushToken);
      }
    } catch (err) {
      setError("Error deleting account. Please try again later.");
    }
    props.onClose();
  };

  const handleOutsideClick = () => {
    Keyboard.dismiss();
    props.onClose();
  };

  // TODO: Refactor to use Container, delegate Snackbar error handling to Container
  return (
    <Modal
      visible={props.isModalVisible}
      animationType="fade"
      transparent={true}
      presentationStyle="overFullScreen"
      onRequestClose={props.onClose}
    >
      <View style={styles.modal}>
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
          <View style={styles.background}></View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.card}>
            <Text style={styles.text}>
              Please enter your password to delete your account.
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              returnKeyType="done"
              autoCapitalize="none"
              testID="PasswordInput"
              style={styles.input}
              secureTextEntry
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={props.onClose}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={deleteAccount}>
                <Text style={styles.buttonText}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  background: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  card: {
    padding: 24,
    marginHorizontal: 12,
    background: "white",
    borderRadius: 12,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: colors.red,
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  closeButton: {
    borderColor: colors.blue,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 17,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  closeButtonText: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 18,
  },
  text: {
    fontSize: 18,
    color: "#333",
    fontWeight: "400",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    borderRadius: 4,
    padding: 12,
    paddingTop: 12,
    paddingBottom: 12,
    marginVertical: 24,
    width: "100%",
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
});

export default DeleteAccountModal;
