import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { auth } from "../../firebase";
import useStore from "../Store";
import colors from "../styles/colors";

export const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, setError } = useStore();
  const [loading, setLoading] = useState<boolean>(false);

  const navigation =
    useNavigation<StackNavigationProp<{ "Faith Forward": undefined }>>();

  const handleError = (err: any): void => {
    console.error(err);
    if (err.message.includes("email-already-in-use")) {
      setError("Email already in use. Try logging in.");
    } else if (err.message.includes("wrong-password")) {
      setError("Wrong password. Try again.");
    } else if (err.message.includes("invalid-email")) {
      setError("Invalid email. Try again.");
    } else if (err.message.includes("user-not-found")) {
      setError("User not found. Try signing up.");
    } else if (err.message.includes("missing-email")) {
      setError("Please enter an email.");
    } else {
      setError(err.message);
    }
  };

  const signUp = async (): Promise<void> => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      if (!auth.currentUser)
        throw new Error("No current user session to link credentials to");
      if (auth.currentUser.isAnonymous) {
        var credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(auth.currentUser, credential);
        auth.currentUser?.reload();
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setError("");
      navigation.navigate("Faith Forward");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (): Promise<void> => {
    try {
      setLoading(true);
      Keyboard.dismiss();
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      navigation.navigate("Faith Forward");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (): Promise<void> => {
    try {
      Keyboard.dismiss();
      await sendPasswordResetEmail(auth, email);
      setError("");
    } catch (err) {
      handleError(err);
    }
  };

  // TODO: Refactor to Container, delegate error Snackbar handling to Container
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {/* I could not for the life of me color the entire screen without using this. */}
      <LinearGradient
        colors={[colors.paper, colors.paper]}
        style={styles.linearGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.brandContainer}>
            <Image
              source={require("../../assets/church.png")}
              resizeMode="contain"
              style={styles.logo}
            />
            <View style={styles.faithForward}>
              <Text style={styles.faithForwardText}>Faith Forward</Text>
            </View>
          </View>
          <KeyboardAvoidingView
            style={styles.content}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.authCard}>
              <View style={styles.inputs}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  testID="EmailInput"
                  style={styles.input}
                />
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
              </View>
              <View style={styles.authButtons}>
                <TouchableOpacity
                  onPress={signUp}
                  style={[styles.authButton, { opacity: loading ? 0.5 : 1 }]}
                  testID="SignUpButton"
                  disabled={loading}
                >
                  <Text style={styles.authButtonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={signIn}
                  style={[
                    styles.authButton,
                    styles.logInButton,
                    { opacity: loading ? 0.5 : 1 },
                  ]}
                  testID="LogInButton"
                  disabled={loading}
                >
                  <Text style={[styles.authButtonText, styles.logInButtonText]}>
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.forgotPasswordView}>
                <TouchableOpacity
                  style={[
                    styles.forgotPasswordButton,
                    { opacity: loading ? 0.5 : 1 },
                  ]}
                  onPress={handlePasswordReset}
                  disabled={loading}
                >
                  <Text style={styles.forgotPasswordButtonText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
          <Snackbar
            visible={!!error}
            onDismiss={() => setError(null)}
            action={{
              label: "Dismiss",
              onPress: () => setError(null),
            }}
          >
            {error}
          </Snackbar>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const { width } = Dimensions.get("window");

// TODO: Dynamically pad/size everything from device dimensions
const styles = StyleSheet.create({
  authButton: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    padding: 15,
    width: width * 0.35,
  },
  authButtons: {
    flexDirection: "row",
    marginVertical: 5,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  authButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  authCard: {
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: colors.paper,
  },
  brandContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    backgroundColor: colors.paper,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    // minHeight: height,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  faithForward: {
    marginBottom: 40,
  },
  faithForwardText: {
    fontSize: 36,
    fontWeight: "600",
    // fontFamily: "Avenir",
  },
  forgotPassword: {},
  forgotPasswordButton: {
    marginVertical: 10,
  },
  forgotPasswordButtonText: {
    textAlign: "center",
    fontStyle: "italic",
    paddingTop: 20,
    color: "#808080",
  },
  forgotPasswordView: {},
  input: {
    height: 50,
    width: width * 0.8,
    borderColor: "#808080",
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  inputs: {
    paddingBottom: 10,
  },
  linearGradient: {
    flex: 1,
  },
  logInButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.blue,
  },
  logInButtonText: {
    color: colors.blue,
  },
  logo: {
    marginVertical: 10,
    width: width * 0.7,
    height: width * 0.7,
    /* width: 200, */
    /* height: 200, */
  },
});

export default AuthScreen;
