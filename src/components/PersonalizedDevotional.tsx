import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { logCreateDevotional } from "@src/analytics";
import { BigButton } from "@src/components/BigButton";
import VerseContainer from "@src/components/VerseContainer";
import { API_URL } from "@src/constants";
import { auth } from "@src/firebase";
import { useApi } from "@src/hooks/useApi";
import { useLoadingMessage } from "@src/hooks/useLoadingMessage";
import { useRequestReview } from "@src/hooks/useRequestReview";
import useStore from "@src/store";
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
  const { promptStart, input, setInput, setDevotional, error, setError } =
    useStore();
  const inputRef = useRef<TextInput>(null);
  const {
    isLoading,
    data,
    requestTime,
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

    if (data && data.response) {
      if (!data.promptId) {
        console.warn("No promptId returned from API");
      }
      setDevotional(data.response);
      logCreateDevotional(data.promptId, input, requestTime || 0);
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
          <View style={{ marginBottom: 32, alignItems: "center" }}>
            <Text className="text-ffBlack text-[28px] font-bold py-2">
              What's on your mind?
            </Text>
            <Text style={{ color: "#444", fontSize: 16, fontWeight: "500" }}>
              Receive a tailored devotional just for you
            </Text>
          </View>
          <TextInput
            className="w-4/5 h-40 bg-ffPaper border-2 border-ffBlue rounded-lg p-4 my-4 items-center justify-center self-center"
            style={styles.input}
            placeholder="Enter your thoughts or prayers here..."
            placeholderTextColor="#999"
            onChangeText={(text) => setInput(text)}
            value={input}
            multiline
          />
          <View className="flex-row justify-center items-center">
            <BigButton
              onPress={submit}
              isLoading={isLoading}
              disabled={isLoading || input.length === 0}
            >
              {isLoading ? (
                <LoadingMessage />
              ) : (
                <Text className="text-white text-lg font-bold">
                  Get Devotional
                </Text>
              )}
            </BigButton>
          </View>
          <TouchableOpacity onPress={seePastDevos} className="py-5">
            <Text
              style={{
                color: "#444",
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              See past devotionals
            </Text>
          </TouchableOpacity>
          <VerseContainer />
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

function LoadingMessage() {
  const message = useLoadingMessage("Writing your devotional");

  return <Text className="text-white text-lg italic">{message}</Text>;
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
  header: {
    fontSize: 28,
    flexDirection: "row",
    marginBottom: 48,
    fontWeight: "600",
  },
  input: {
    minHeight: 100,
    backgroundColor: "rgba(0, 0, 0, 0.07)",
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
