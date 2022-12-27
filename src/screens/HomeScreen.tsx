import React, { useState } from "react";
import {
  Animated,
  Button,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import KeywordManager from "../components/KeywordManager";
import useInput from "../components/useInput";
import { useApi } from "../services/api";
import colors from "../styles/colors";

const HomeScreen: React.FC = () => {
  const [anim] = useState(new Animated.Value(0));
  const [inputComponent, inputValue, setInputValue] = useInput(
    "How are you today?",
    { align: "center" }
  );
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
      body: JSON.stringify({ prompt: inputValue }),
      headers: { "Content-Type": "application/json" },
    }
  );

  const submit = () => {
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

  return (
    <View style={styles.container}>
      <KeywordManager
        onPress={(value: string) => {
          setInputValue(value);
        }}
      />
      {inputComponent}
      <Button title="Get a verse" onPress={submit} color={colors.orange} />
      {isLoading || verse ? (
        <Animated.View style={[styles.verse, { opacity: anim }]}>
          <ScrollView>
            {verse && verse.response ? (
              <Text style={styles.response}>{verse.response}</Text>
            ) : (
              <Text style={styles.response}>Loading</Text>
            )}
          </ScrollView>
        </Animated.View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    // marginTop: -100,
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
  response: {
    fontSize: 20,
    padding: 36,
    paddingTop: 8,
    color: "#fff",
    lineHeight: 28,
  },
  verse: {
    flex: 1,
    backgroundColor: colors.blue,
    paddingTop: 24,
    marginTop: 24,
    width: "100%",
    alignItems: "center",
  },
});

export default HomeScreen;
