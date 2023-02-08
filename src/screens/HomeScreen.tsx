import React, { useEffect, useRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import apiConfig from "../../apiConfig";
import { auth } from "../../firebase";
import VerseContainer from "../components/VerseContainer";
import { PLACEHOLDERS } from "../constants";
import { useApi } from "../hooks/useApi";
import useStore from "../Store";
import colors from "../styles/colors";

const HomeScreen: React.FC = () => {
  const {
    promptStart,
    input,
    setInput,
    setDevotional,
    setPromptId,
    error,
    setError,
  } = useStore();
  const inputRef = useRef<TextInput>(null);
  const {
    isLoading,
    data,
    fetchData: getDevotional,
  } = useApi<{
    response: string;
    promptId: string;
  }>(`${apiConfig.apiUrl}/getGpt3Response`, {
    method: "POST",
    body: JSON.stringify({
      userId: auth.currentUser?.uid,
      prompt: input,
    }),
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (data && data.response && data.promptId) {
      setPromptId(data.promptId);

      // Use regex to remove any leading or trailing text that is like a formal letter
      const response = data.response.replace(/(^.*?,\n\n)|(\n.*?,\n.*$)/g, "");

      setDevotional(response);
    }
  }, [data]);

  useEffect(() => {
    if (promptStart) {
      let formattedPrompt = promptStart.split(".")[0] + " ";
      setInput(formattedPrompt);
      if (inputRef.current) inputRef.current.focus();
    } else {
      setInput("");
    }
  }, [promptStart]);

  const submit = () => {
    getDevotional();
    setDevotional("");
    Keyboard.dismiss();
  };

  const getRandomExample = () => {
    setInput(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.header}>What is on your mind?</Text>
          </View>

          <TextInput
            ref={inputRef}
            style={[styles.input]}
            placeholder="Type your question or describe your situation here..."
            placeholderTextColor="#999"
            onChangeText={(text) => setInput(text)}
            value={input}
            multiline
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={submit}
              style={[
                styles.button,
                { opacity: input && !isLoading ? 1 : 0.4 },
              ]}
              disabled={!input || isLoading}
            >
              <Text style={styles.buttonText}>Get Guidance</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                marginTop: 18,
                width: "100%",
              }}
              onPress={getRandomExample}
              disabled={isLoading}
            >
              <Text
                style={[styles.buttonText, { color: "#444", marginTop: 12 }]}
              >
                Random
              </Text>
            </TouchableOpacity>
          </View>
          <VerseContainer isLoading={isLoading} />
        </View>
      </ScrollView>
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
    </KeyboardAvoidingView>
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
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 124,
    paddingBottom: 48,
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
    width: "80%",
    justifyContent: "flex-end",
  },
  input: {
    minHeight: 140,
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    borderRadius: 4,
    margin: 10,
    padding: 12,
    paddingTop: 12,
    paddingBottom: 12,
    width: "80%",
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
});

export default HomeScreen;
