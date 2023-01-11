import React, { useRef } from "react";
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
import { auth } from "../../firebase";
import KeywordManager from "../components/KeywordManager";
import VerseContainer from "../components/VerseContainer";
import { useApi } from "../services/api";
import useStore from "../Store";
import colors from "../styles/colors";

const HomeScreen: React.FC = () => {
  const { promptStart, input, setInput } = useStore();
  const inputRef = useRef<TextInput>(null);

  const {
    isLoading,
    data: verse,
    fetch,
    setResponseData: setVerse,
  } = useApi(
    "https://us-central1-faith-forward-staging.cloudfunctions.net/getGpt3Response",
    {
      method: "POST",
      body: JSON.stringify({
        userId: auth.currentUser?.uid,
        prompt: input,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  React.useEffect(() => {
    if (promptStart) {
      let formattedPrompt = promptStart.split(".")[0] + " ";
      setInput(formattedPrompt);
      if (inputRef.current) inputRef.current.focus();
    } else {
      setInput("");
    }
  }, [promptStart]);

  const submit = () => {
    fetch();
    setVerse(null);
    Keyboard.dismiss();
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

          <KeywordManager />

          <TextInput
            ref={inputRef}
            style={[styles.input]}
            placeholder="Type your thoughts or choose a suggestion above"
            placeholderTextColor="#999"
            onChangeText={(text) => setInput(text)}
            value={input}
            // onBlur={handleBlur}
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
          <VerseContainer verse={verse} isLoading={isLoading} />
        </View>
      </ScrollView>
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
    height: 140,
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
