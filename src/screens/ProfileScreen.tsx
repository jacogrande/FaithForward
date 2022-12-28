import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase";
import colors from "../styles/colors";

// TODO: Unstub account level
const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Profile</Text>
        <Text style={styles.heading}>
          {/* Email: {auth.currentUser?.email} */}
          Email
        </Text>
        <Text style={styles.text}>{auth.currentUser?.email}</Text>
        <Text style={styles.heading}>Account Level</Text>
        <Text style={styles.text}>Free</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={() => auth.signOut()}>
          Sign Out
        </Text>
        {/* <Button title="Sign Out" onPress={() => auth.signOut()} /> */}
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
  },
});

export default ProfileScreen;
