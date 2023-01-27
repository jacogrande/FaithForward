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
import { useApi } from "../hooks/useApi";
import useStore from "../Store";
import colors from "../styles/colors";

const PLACEHOLDERS = [
  "I've been struggling with feelings of doubt and uncertainty in my faith recently, and I'm not sure how to handle it. I've been feeling like I don't have a strong connection to God, and I'm not sure if I'm doing something wrong or if this is just a normal part of the faith journey.",
  "I've been going through a difficult time in my personal life, and I'm finding it hard to keep up with my spiritual practices. I'm feeling overwhelmed and disconnected, and I'm not sure how to get back on track. I would appreciate any advice you have on how to maintain my faith during difficult times.",
  "I've been struggling with addiction for a long time, and I feel like I've hit rock bottom. I know that my faith is an important part of my recovery, but I'm not sure how to start incorporating it into my daily life.",
  "I've been feeling a sense of disconnection from my local Christian community recently, and I'm not sure why. I've been attending church regularly, but I'm not feeling the same sense of belonging and connection that I used to.",
  "I've been going through a difficult time in my marriage and I'm not sure how to navigate it.",
  "I'm having trouble forgiving someone who has hurt me deeply and I'm not sure how to reconcile my faith with my feelings.",
  "I've been struggling with doubts about the afterlife.",
  "I'm not sure how to talk to my children about faith.",
  "I'm going through a tough financial situation and I'm not sure how to trust in God's provision during this difficult time.",
  "Is Santa real?",
  "I'm having trouble forgiving someone who has hurt me deeply and I'm not sure how to reconcile my faith with my feelings. Can you help me understand how to forgive?",
  "I'm having trouble sleeping and I'm not sure how to improve my sleep habits and get better rest.",
  "I'm currently in a dilemma of whether to pursue a career in academics or industry and I am not sure which path aligns better with my long-term goals and interests.",
  "I am having trouble dealing with the recent loss of a loved one and struggling to find closure, comfort and move forward with my life.",
  "I am facing a difficult time in my marriage, my partner and I have been growing apart and I am not sure how to communicate effectively and find common ground.",
  "I am struggling with my mental health and have been experiencing severe anxiety and depression for a while now, I am not sure how to seek help and manage it effectively.",
  "I am currently in the process of planning a big event for my community, and it is taking a lot of time and energy to coordinate everything.",
  "I am excited to have recently started a new job and am looking forward to learning and growing in this new role.",
  "I have been working on a creative project and am making progress, but it is taking a lot of time and effort to bring it to fruition.",
];

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

  React.useEffect(() => {
    if (data && data.response && data.promptId) {
      setPromptId(data.promptId);
      setDevotional(data.response);
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
              <Text style={[styles.buttonText, { color: "#555" }]}>Random</Text>
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
