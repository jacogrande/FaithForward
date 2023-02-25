import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import VerseContainer from "@src/components/VerseContainer";
import { API_URL } from "@src/constants";
import { auth } from "@src/firebase";
import { useApi } from "@src/hooks/useApi";
import { useRequestReview } from "@src/hooks/useRequestReview";
import useStore from "@src/Store";
import colors from "@src/styles/colors";
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

export function PersonalizedDevotional() {
  const navigation = useNavigation<StackNavigationProp<any>>();
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
  }>(`${API_URL}/getGpt3Response`, {
    method: "POST",
    body: JSON.stringify({
      userId: auth.currentUser?.uid,
      prompt: input,
    }),
    headers: { "Content-Type": "application/json" },
  });
  const { requestReview } = useRequestReview();

  useEffect(() => {
    let requestReviewTimeout: any;

    if (data && data.response && data.promptId) {
      setPromptId(data.promptId);
      setDevotional(data.response);
      requestReviewTimeout = setTimeout(() => {
        requestReview();
      }, 10000);
    }

    // Call requestReview ten seconds after data comes back
    return () => {
      clearTimeout(requestReviewTimeout);
    };
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

  const seePastDevos = () => {
    navigation.navigate("Past Devotionals", {});
    Keyboard.dismiss();
  };

  // TODO: Refactor to use Container, delegate Snackbar error handling to Container
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
          <View style={{ marginBottom: 20, alignItems: "center" }}>
            <Text
              style={{
                color: colors.black,
                fontSize: 18,
                fontWeight: "500",
                paddingVertical: 10,
              }}
            >
              Ask a question
            </Text>
            <Text style={{ color: colors.black, fontSize: 16 }}>
              Receive a tailored devotional just for you
            </Text>
          </View>
          <TextInput
            ref={inputRef}
            style={[styles.input]}
            placeholder="What's on your mind?"
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
              onPress={seePastDevos}
              style={{ flex: 1, alignItems: "center", paddingVertical: 20 }}
            >
              <Text style={{ color: colors.black, fontSize: 14 }}>
                See past devotionals
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
}

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
