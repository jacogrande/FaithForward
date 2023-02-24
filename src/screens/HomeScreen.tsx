import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Container } from "../components/Container";
import { PersonalizedDevotional } from "../components/PersonalizedDevotional";
import { TraditionalDevotionals } from "../components/TraditionalDevotionals";
import colors from "../styles/colors";

const HomeScreen: React.FC = () => {
  const [devoType, setDevoType] = useState<"traditional" | "personalized">(
    "traditional"
  );

  return (
    <Container>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 20,
        }}
      >
        <TouchableOpacity
          style={[
            styles.devoTypeButton,
            styles.traditionalButton,
            devoType === "traditional" ? styles.devoTypeButtonActive : {},
          ]}
          onPress={() => setDevoType("traditional")}
          disabled={devoType === "traditional"}
        >
          <Ionicons
            name="book-outline"
            size={16}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.buttonText, { color: "white" }]}>
            Traditional
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.devoTypeButton,
            styles.personalizedButton,
            devoType === "personalized" ? styles.devoTypeButtonActive : {},
          ]}
          onPress={() => setDevoType("personalized")}
          disabled={devoType === "personalized"}
        >
          <Ionicons
            name="person-outline"
            size={16}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.buttonText, { color: "white" }]}>
            Personalized
          </Text>
        </TouchableOpacity>
      </View>
      {devoType === "personalized" ? (
        <PersonalizedDevotional />
      ) : (
        <TraditionalDevotionals />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  scroller: {
    backgroundColor: colors.paper,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 4,
    paddingVertical: 18,
    width: "100%",
    marginTop: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  header: {
    fontSize: 28,
    flexDirection: "row",
    marginBottom: 48,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "baseline",
    width: "87%",
    justifyContent: "flex-end",
  },
  input: {
    minHeight: 140,
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    borderRadius: 4,
    margin: 10,
    padding: 10,
    paddingTop: 12,
    paddingBottom: 12,
    width: "87%",
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
  devoTypeButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    borderRadius: 4,
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  traditionalButton: {
    backgroundColor: colors.blue,
  },
  personalizedButton: {
    backgroundColor: colors.orange,
  },
  devoTypeButtonActive: {
    // Deactivate shadow
    shadowColor: "transparent",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
});

export default HomeScreen;
