import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { logGetExegesis } from "@src/analytics";
import BaseText from "@src/components/ui/BaseText";
import { BigButton } from "@src/components/ui/BigButton";
import BiggerText from "@src/components/ui/BiggerText";
import SmallText from "@src/components/ui/SmallText";
import { API_URL } from "@src/constants";
import { auth } from "@src/firebase";
import { useLoadingMessage } from "@src/hooks/useLoadingMessage";
import { usePastExegeses } from "@src/hooks/usePastExegeses";
import useStore from "@src/store";
import colors from "@src/styles/colors";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";

export function NewExegesis() {
  const navigation = useNavigation<any>();
  const [input, setInput] = useState("");
  const [isLoadingExegesis, setIsLoadingExegesis] = useState(false);
  const { setQuietlyRefreshing } = usePastExegeses();
  const { error, setError } = useStore();

  async function getGeneralExegesis() {
    try {
      setIsLoadingExegesis(true);
      logGetExegesis("", 0, 0, "general");

      const userId = auth.currentUser?.uid;

      await fetch(`${API_URL}/getGeneralExegesis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          input: input,
        }),
      });

      setQuietlyRefreshing(true);
      setInput("");
      navigation.navigate("PastExegeses", { expandFirst: true });
    } catch (err: any) {
      console.warn("Error getting general exegesis:");
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoadingExegesis(false);
    }
  }

  // TODO: Consolidate styles / components between this and PersonalizedDevotional
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{ height: "100%" }}
        className="flex-1 justify-center items-center bg-ffPaper"
      >
        <View style={{ marginBottom: 32, alignItems: "center" }}>
          <BiggerText className="py-2">Ask the Bible</BiggerText>
          <BaseText className="font-medium">
            Explore the deeper meaning of the Word
          </BaseText>
        </View>
        <TextInput
          className="w-4/5 h-40 text-ffText overflow-scroll font-medium bg-ffDarkPaper rounded p-3 my-4 text-base"
          placeholder="What are you curious about?"
          placeholderTextColor="#999"
          onChangeText={(text) => setInput(text)}
          value={input}
          multiline
        />
        <View className="flex-row justify-center items-center">
          <BigButton
            onPress={getGeneralExegesis}
            isLoading={isLoadingExegesis}
            disabled={isLoadingExegesis || input.length === 0}
          >
            {isLoadingExegesis ? (
              <LoadingMessage />
            ) : (
              <BaseText className="text-white font-bold">Get Analysis</BaseText>
            )}
          </BigButton>
        </View>
        <TouchableOpacity
          className="py-5 items-center justify-center flex flex-row space-x-1"
          onPress={() => navigation.navigate("PastExegeses")}
        >
          <MaterialIcons name="history" size={18} color={colors.text} />
          <SmallText className="text-ffText font-medium">History</SmallText>
        </TouchableOpacity>
      </View>
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
  const message = useLoadingMessage("Writing analysis");

  return (
    <BaseText className="text-white font-medium italic">{message}</BaseText>
  );
}
