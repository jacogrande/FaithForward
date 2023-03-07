import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { logCreateDevotional } from "@src/analytics";
import { BigButton } from "@src/components/ui/BigButton";
import VerseContainer from "@src/components/VerseContainer";
import { API_URL } from "@src/constants";
import { auth } from "@src/firebase";
import { useApi } from "@src/hooks/useApi";
import { useLoadingMessage } from "@src/hooks/useLoadingMessage";
import { useRequestReview } from "@src/hooks/useRequestReview";
import useStore from "@src/store";
import React, { useEffect, useRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import BaseText from "@src/components/ui/BaseText";
import BiggerText from "@src/components/ui/BiggerText";
import SmallText from "@src/components/ui/SmallText";

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
            <BiggerText className="py-2">What's on your mind?</BiggerText>
            <BaseText className="font-medium">
              Receive a tailored devotional just for you
            </BaseText>
          </View>
          <TextInput
            className="w-4/5 h-40 text-ffText overflow-scroll font-medium bg-ffDarkPaper rounded p-3 my-4 text-base"
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
                <BaseText className="text-white font-bold">
                  Get Devotional
                </BaseText>
              )}
            </BigButton>
          </View>
          <TouchableOpacity
            onPress={seePastDevos}
            className="py-3 mt-4 items-center justify-center flex flex-row space-x-2"
          >
            <FontAwesome name="history" size={18} />
            <SmallText className="text-ffText font-medium">History</SmallText>
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
    <BaseText className="text-white font-medium italic">{message}</BaseText>
  );
}
