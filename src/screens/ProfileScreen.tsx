import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../../firebase";
import colors from "../styles/colors";

// TODO: Unstub account level
const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>
          Email: {auth.currentUser?.email}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>
          Account Level: Free
        </Text>
      </View>
      <Button title="Sign Out" onPress={() => auth.signOut()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    textAlign: "left",
    backgroundColor: colors.paper,
    paddingTop: 64,
  },
  section: {
    marginBottom: 16,
    marginTop: 8,
  },
});

export default ProfileScreen;
