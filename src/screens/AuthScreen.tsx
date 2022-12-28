import { LinearGradient } from "expo-linear-gradient";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../../firebase";

// TODO: Should create / auth user in auth and in Firestore
// TODO: Support forgot password flow
export const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
      await createUserWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      handleError(err);
    }
  };

  const signIn = async (): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
    } catch (err) {
      handleError(err);
    }
  };

  const handlePasswordReset = async (): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
      setError("");
    } catch (err) {
      handleError(err);
    }
  };

  // TODO: Auth components in card, popped-out
  // TODO: Snackbar error
  return (
    <LinearGradient
      colors={["#5EB5D1", "#E6F5FA"]}
      style={styles.linearGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <Image
          source={require("../../assets/logo-book.png")}
          resizeMode="contain"
          style={styles.logo}
        />
        <View style={styles.faithForward}>
          <Text style={styles.faithForwardText}>Faith Forward</Text>
        </View>
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
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
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.actions}>
            <Pressable
              onPress={signUp}
              style={styles.authButton}
              testID="SignUpButton"
            >
              <Text style={styles.authButtonText}>Sign Up</Text>
            </Pressable>
            <Pressable
              onPress={signIn}
              style={[styles.authButton, styles.logInButton]}
              testID="LogInButton"
            >
              <Text style={[styles.authButtonText, styles.logInButtonText]}>
                Log In
              </Text>
            </Pressable>
            <Pressable
              style={styles.forgotPasswordButton}
              onPress={handlePasswordReset}
            >
              <Text style={styles.forgotPasswordButtonText}>
                Forgot password?
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  linearGradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    width: width * 0.4,
    flex: 1,
  },
  faithForward: {},
  faithForwardText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0A3D62",
    fontFamily: "Avenir",
  },
  input: {
    height: 50,
    width: width * 0.8,
    borderColor: "gray",
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  inputs: {},
  error: {
    color: "red",
    textAlign: "center",
  },
  actions: {
    flexDirection: "column",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  actionButton: {
    flex: 1,
  },
  forgotPassword: {},
  authButton: {
    backgroundColor: "#1E90FF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    width: width * 0.8,
  },
  logInButton: {
    backgroundColor: "white",
    borderColor: "#E6F5FA",
  },
  authButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  logInButtonText: {
    color: "#1E90FF",
  },
  forgotPasswordButton: {
    marginVertical: 10,
  },
  forgotPasswordButtonText: {
    textAlign: "center",
    color: "#0A3D62",
  },
});

export default AuthScreen;
