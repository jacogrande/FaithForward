import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
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
import { TTradDevo } from "../../types";
import { Container } from "../components/Container";
import VerseContainer from "../components/VerseContainer";
import { useApi } from "../hooks/useApi";
import { useTradDevos } from "../hooks/useTradDevos";
import useStore from "../Store";
import colors from "../styles/colors";
import * as StoreReview from "expo-store-review";
import { formatDate } from "../utils";

const HomeScreen: React.FC = () => {
  const [devoType, setDevoType] = useState<"traditional" | "personalized">(
    "traditional"
  );

  return (
    <Container>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 20,
        }}
      >
        <TouchableOpacity
          style={[
            styles.devoTypeButton,
            styles.traditionalButton,
            devoType === "traditional" ? styles.devoTypeButtonActive : {},
          ]}
          onPress={() => setDevoType("traditional")}
          disabled={devoType === "traditional"}
        >
          <Ionicons
            name="book-outline"
            size={16}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.buttonText, { color: "white" }]}>
            Traditional
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.devoTypeButton,
            styles.personalizedButton,
            devoType === "personalized" ? styles.devoTypeButtonActive : {},
          ]}
          onPress={() => setDevoType("personalized")}
          disabled={devoType === "personalized"}
        >
          <Ionicons
            name="person-outline"
            size={16}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.buttonText, { color: "white" }]}>
            Personalized
          </Text>
        </TouchableOpacity>
      </View>
      {devoType === "personalized" ? (
        <PersonalizedDevotional />
      ) : (
        <TraditionalDevotional />
      )}
    </Container>
  );
};

function PersonalizedDevotional() {
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

  useEffect(() => {
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

  // TODO: Add proper handling for review requests
  /* useEffect(() => { */
  /*   const requestReview = async () => { */
  /*     console.log("Checking if we can request review..."); */
  /*     if (await StoreReview.hasAction()) { */
  /*       console.log("We can request review!"); */
  /*       StoreReview.requestReview(); */
  /*       console.log("StoreReview.storeUrl():", StoreReview.storeUrl()); */
  /*     } */
  /*   }; */
  /**/
  /*   requestReview(); */
  /* }, []); */

  const submit = () => {
    getDevotional();
    setDevotional("");
    Keyboard.dismiss();
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

function TraditionalDevotional() {
  const { tradDevos, loading, refreshing, setRefreshing } = useTradDevos();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={tradDevos}
        renderItem={({ item }) => <DevotionalCard devotional={item} />}
        keyExtractor={(item) => item.id}
        style={{ width: "100%", paddingHorizontal: 20 }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 24 }}>
            <Text style={{ fontSize: 18, color: "#999" }}>
              No devotions found
            </Text>
          </View>
        )}
        ListFooterComponent={() => <View style={{ height: 48 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      />
    </View>
  );
}

function DevotionalCard({ devotional }: { devotional: TTradDevo }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View
      style={{
        borderRadius: 12,
        paddingVertical: 24,
        paddingHorizontal: 4,
        borderBottomColor: colors.lightBlue,
        borderBottomWidth: 2,
      }}
    >
      <TouchableOpacity onPress={handleToggleExpanded}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
          {devotional.title}
        </Text>
        <Text style={{ fontSize: 14, color: "#999", marginBottom: 12 }}>
          {formatDate(devotional.createdAt)}
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            marginBottom: isExpanded ? 12 : 0,
            fontStyle: "italic",
          }}
        >
          {devotional.input}
        </Text>
      </TouchableOpacity>
      {isExpanded && (
        <>
          <View
            style={{
              borderTopColor: "#eee",
              borderTopWidth: 1,
              paddingTop: 12,
              marginBottom: 12,
              // TODO: Make section more visually distinct
              // TODO: Support verse highlighting and clickthrough actions here
              // TODO: Only have a single devo expanded at a time
            }}
          >
            <Text style={{ fontSize: 16, lineHeight: 24 }}>
              {devotional.response}
            </Text>
          </View>
        </>
      )}
    </View>
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

export default HomeScreen;
