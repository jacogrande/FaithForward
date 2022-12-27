import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import colors from "../styles/colors";
import { auth } from "../../firebase";

// TODO: Unstub
//       - email
//       - account level
//       - reset password link
// TODO: Add signout button
const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>jane.doe@example.com</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Account Level:</Text>
        <Text style={styles.value}>Premium</Text>
      </View>
      <Button
        title="Reset Password"
        onPress={() => {
          // TODO: Perform reset password logic here
        }}
      />
      <Button title="Sign Out" onPress={() => auth.signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    textAlign: "center",
    backgroundColor: colors.paper,
  },
  section: {
    marginBottom: 16,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  value: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default ProfileScreen;
