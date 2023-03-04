import { API_URL } from "@src/constants";
import { logGetExegesis } from "@src/analytics";
import { useNavigation } from "@react-navigation/native";
import { auth } from "@src/firebase";
import { useLoadingMessage } from "@src/hooks/useLoadingMessage";
import { usePastExegeses } from "@src/hooks/usePastExegeses";
import useStore from "@src/store";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { BigButton } from "@src/components/BigButton";

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
      navigation.navigate("PastExegeses");
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
          <Text className="text-ffBlack text-[28px] font-bold py-2">
            Ask the Bible
          </Text>
          <Text style={{ color: "#444", fontSize: 16, fontWeight: "500" }}>
            Find new meaning in scripture
          </Text>
        </View>
        <TextInput
          className="w-4/5 h-40 bg-ffPaper border-2 border-ffBlue rounded-lg p-4 my-4 items-center justify-center self-center"
          style={styles.input}
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
              <Text className="text-white text-lg font-bold">Get Exegesis</Text>
            )}
          </BigButton>
          {/* <TouchableOpacity */}
          {/*   onPress={getGeneralExegesis} */}
          {/*   style={{ opacity: isLoadingExegesis ? 0.5 : 1 }} */}
          {/*   className={`w-4/5 p-4 rounded-lg bg-ffBlue items-center justify-center self-center`} */}
          {/*   disabled={isLoadingExegesis} */}
          {/* > */}
          {/*   {isLoadingExegesis ? ( */}
          {/*     <LoadingMessage /> */}
          {/*   ) : ( */}
          {/*     <Text className="text-white text-lg font-bold">Get Exegesis</Text> */}
          {/*   )} */}
          {/* </TouchableOpacity> */}
        </View>
        <TouchableOpacity
          className="py-5"
          onPress={() => navigation.navigate("PastExegeses")}
        >
          <Text
            style={{
              color: "#444",
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            See past exegeses
          </Text>
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
  const message = useLoadingMessage("Writing exegesis");

  return <Text className="text-white text-lg italic">{message}</Text>;
}

const styles = StyleSheet.create({
  input: {
    minHeight: 100,
    backgroundColor: "rgba(0, 0, 0, 0.07)",
    fontSize: 16,
    fontWeight: "500",
    color: "#444",
  },
});
