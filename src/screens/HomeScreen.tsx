import React, { useState } from "react";
import {
  Animated,
  Button,
  Keyboard,
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
import colors from "../styles/colors";

const HomeScreen: React.FC = () => {
  const [anim] = useState<Animated.Value>(new Animated.Value(0));
  const [inputComponent, inputValue, setInputValue] = useInput(
    "What is on your mind?",
    { multiline: true }
  );
  const [verseOpened, setVerseOpened] = React.useState<boolean>(false);
  const [showButton, setShowButton] = React.useState<boolean>(false);
  const [showInput, setShowInput] = React.useState<boolean>(false);
  const [topic, setTopic] = React.useState<string | null>(null);
  const [emotion, setEmotion] = React.useState<string | null>(null);
  const [verseInputComponent, verseInputValue, setVerseInputValue] =
    useInput("");

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
        prompt: inputValue,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const submit = () => {
    setInputValue(verseInputValue);
    fetch();
    setVerse(null);
    Keyboard.dismiss();
    if (!verseOpened) {
      setVerseOpened(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  React.useEffect(() => {
    if (topic === "Something Else") {
      setShowInput(true);
      setShowButton(true);
    }
  }, [topic]);

  React.useEffect(() => {
    setVerseInputValue(inputValue);
  }, [inputValue]);

  React.useEffect(() => {
    if (emotion && topic) {
      setInputValue(`I feel ${emotion} about ${topic}.`);
    }
  }, [emotion, topic]);

  const getHeader = () => {
    if (topic === "Something Else") {
      return "Something Else?";
    } else if (topic) {
      return `How do you feel about`;
    } else {
      return "What is on your mind?";
    }
  };

  const getHeaderStyles = () => {
    if (topic === "Something Else") {
      return [styles.header, { marginBottom: 24 }];
    } else return styles.header;
  };

  const reset = () => {
    setShowInput(false);
    setShowButton(false);
    setTopic(null);
    setEmotion(null);
    setVerseInputValue("");
    setInputValue("");
    setVerse(null);
  };

  if (isLoading || verse) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          {verseInputComponent}
          <View style={[styles.buttonRow, { justifyContent: "flex-end" }]}>
            <Button title="Back" onPress={reset} />
            <TouchableOpacity
              onPress={submit}
              style={[
                styles.button,
                {
                  opacity: inputValue || (emotion && topic) ? 1 : 0.4,
                  marginTop: 16,
                },
              ]}
              disabled={!inputValue}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <VerseContainer verse={verse} anim={anim} />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      activeOpacity={1}
      style={{ width: "100%", height: "100%" }}
    >
      <View style={styles.container}>
        <Text style={getHeaderStyles()}>{getHeader()}</Text>
        {showInput ? (
          inputComponent
        ) : (
          <KeywordManager
            setTopic={(value: string | null) => setTopic(value)}
            setEmotion={(value: string | null) => setEmotion(value)}
            setShowSubmit={(value: boolean) => setShowButton(value)}
            verseLoaded={Boolean(verse) || Boolean(isLoading)}
            resetParent={reset}
          />
        )}
        <View
          style={[
            styles.buttonRow,
            { justifyContent: showInput ? "flex-end" : "center" },
          ]}
        >
          {showInput && (
            <Button title="Cancel" color={colors.blue} onPress={reset} />
          )}
          {showButton && (
            <TouchableOpacity
              onPress={submit}
              style={[
                styles.button,
                { opacity: inputValue || (emotion && topic) ? 1 : 0.4 },
              ]}
              disabled={!inputValue}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
        {isLoading || verse ? (
          <VerseContainer verse={verse} anim={anim} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    backgroundColor: colors.lightPaper,
    borderRadius: 4,
    margin: 10,
    padding: 10,
    width: "80%",
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.orange,
    borderRadius: 4,
    paddingHorizontal: 48,
    paddingVertical: 18,
    marginTop: 36,
    marginLeft: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    fontSize: 28,
    flexDirection: "row",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "baseline",
    width: "80%",
  },
  headerContainer: {
    paddingBottom: 24,
    paddingTop: 100,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    // backgroundColor: colors.blue,
  },
});

export default HomeScreen;
