import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../../firebase";
import colors from "../styles/colors";

// TODO: Should create / auth user in auth and in Firestore
// TODO: Support forgot password flow
export const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleError = (err: any): void => {
    console.error(err);
    // If message contains "email-already-in-use" then set error to "Email already in use. Try logging in."
    if (err.message.includes("email-already-in-use")) {
      setError("Email already in use. Try logging in.");
    } else if (err.message.includes("wrong-password")) {
      setError("Wrong password. Try again.");
    } else if (err.message.includes("invalid-email")) {
      setError("Invalid email. Try again.");
    } else if (err.message.includes("user-not-found")) {
      setError("User not found. Try signing up.");
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
        {!!error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.actions}>
          <Button title="Sign Up" onPress={signUp} testID="SignUpButton" />
          <Button title="Sign In" onPress={signIn} testID="SignInButton" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  signUp: {
    position: "absolute",
    bottom: 36,
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  signUpText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "rgba(0,0,0,0.6)",
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  error: {
    color: "#cc0000",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    height: 40,
    width: "75%",
    margin: 10,
  },
});

export default SignUpScreen;
