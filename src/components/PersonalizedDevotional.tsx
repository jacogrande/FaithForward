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
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-ffPaper"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center bg-ffPaper py-16">
          <View style={{ marginBottom: 32, alignItems: "center" }}>
            <Text className="text-ffBlack text-h1 font-bold py-2">
              What's on your mind?
            </Text>
            <Text className="font-medium text-ffText text-h2">
              Receive a tailored devotional just for you
            </Text>
          </View>
          <TextInput
            className="w-4/5 h-40 text-ffText overflow-scroll font-medium bg-ffDarkPaper rounded p-3 my-4 text-h2"
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
                <Text className="text-white font-bold text-h2">
                  Get Devotional
                </Text>
              )}
            </BigButton>
          </View>
          <TouchableOpacity onPress={seePastDevos} className="py-3 mt-4">
            <Text className="text-ffText text-[14px] font-medium">
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

  return (
    <Text className="text-white font-medium text-h2 italic">{message}</Text>
  );
}
