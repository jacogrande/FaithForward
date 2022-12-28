import React, { useState } from "react";
import {
  Animated,
  Button,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebase";
import KeywordManager from "../components/KeywordManager";
import useInput from "../components/useInput";
import VerseContainer from "../components/VerseContainer";
import { useApi } from "../services/api";
import useStore from "../Store";
import colors from "../styles/colors";

const HomeScreen: React.FC = () => {
  const { promptStart, input, setInput } = useStore();
  const [inputComponent, inputComponentValue, setInputComponentValue] =
    useInput("", {
      multiline: true,
      setLinkedValue: setInput,
    });
  const [verseOpened, setVerseOpened] = React.useState<boolean>(false);
  const {
    isLoading,
    data: verse,
    fetch,
    setResponseData: setVerse,
  } = useApi(
    "https://us-central1-robo-jesus.cloudfunctions.net/getGpt3Response",
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
      setInputComponentValue(formattedPrompt);
    } else {
      setInput("");
      setInputComponentValue("");
    }
  }, [promptStart]);

  const submit = () => {
    fetch();
    setVerse(null);
    Keyboard.dismiss();
  };

  // if (isLoading || verse) {
  //   return (
  //     <View style={styles.container}>
  //       <View style={styles.headerContainer}>
  //         {verseInputComponent}
  //         <View style={[styles.buttonRow, { justifyContent: "flex-end" }]}>
  //           <Button title="Back" onPress={reset} />
  //           <TouchableOpacity
  //             onPress={submit}
  //             style={[
  //               styles.button,
  //               {
  //                 opacity: input && !isLoading ? 1 : 0.4,
  //                 marginTop: 16,
  //               },
  //             ]}
  //             disabled={!input || isLoading}
  //           >
  //             <Text style={styles.buttonText}>Submit</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //       <VerseContainer verse={verse} anim={anim} />
  //     </View>
  //   );
  // }

  return (
    <ScrollView
      style={styles.scroller}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="always"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <View>
            <Text style={styles.header}>What is on your mind?</Text>
          </View>
          <KeywordManager />
          {inputComponent}
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
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroller: {
    // height: "100%",
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
});

export default HomeScreen;
