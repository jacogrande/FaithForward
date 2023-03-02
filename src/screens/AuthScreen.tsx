import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { logLogin, logSignup } from "@src/analytics";
import { auth } from "@src/firebase";
import useStore from "@src/store";
import colors from "@src/styles/colors";
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
      logSignup("email");
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
      logLogin("email");
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
        className="flex-1"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <View className="flex-1 items-center">
            <Image
              source={require("@assets/church.png")}
              resizeMode="contain"
              style={styles.logo}
            />
            <View className="mt-5">
              <Text className="text-4xl font-semibold">Faith Forward</Text>
            </View>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View className="pt-10 pb-5 bg-ffPaper">
              <View className="pb-5">
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
              <View>
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
  error: {
    color: "red",
    textAlign: "center",
  },
  forgotPasswordButton: {
    marginVertical: 10,
  },
  forgotPasswordButtonText: {
    textAlign: "center",
    fontStyle: "italic",
    paddingTop: 20,
    color: "#808080",
  },
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
  },
});

export default AuthScreen;
