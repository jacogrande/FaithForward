import * as React from "react";
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Button,
  StyleSheet,
  Keyboard,
} from "react-native";
import useInput from "../components/useInput";
import { useApi } from "../services/api";
import colors from "../styles/colors";

const SignUpScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [emailComponent, email, setEmail] = useInput("Email");
  const [passwordComponent, password, setPassword] = useInput("Password", {
    type: "password",
  });

  const {
    isLoading: isRegistering,
    data: registrationData,
    fetch: register,
  } = useApi(
    "https://us-central1-robo-jesus.cloudfunctions.net/getGpt3Response",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const {
    isLoading: isLoggingIn,
    data: loginData,
    fetch: login,
  } = useApi(
    "https://us-central1-robo-jesus.cloudfunctions.net/getGpt3Response",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const handleRegister = async () => {};

  const handleLogin = async () => {
    navigation.navigate("Zeal");
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        {emailComponent}
        {passwordComponent}
        <Button title="Sign In" onPress={handleLogin} color={colors.orange} />
        <View style={styles.signUp}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <Button
            color={colors.blue}
            title="Sign Up"
            onPress={handleRegister}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
});

export default SignUpScreen;
