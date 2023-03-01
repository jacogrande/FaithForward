import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { logGoToChapter } from "@src/analytics";
import { API_URL } from "@src/constants";
import { auth } from "@src/firebase";
import useStore, { useBibleStore } from "@src/store";
import colors from "@src/styles/colors";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface VerseActionModalProps {
  isModalVisible: boolean;
  verse: string | null;
  onClose: () => void;
}

const VerseActionModal: React.FC<VerseActionModalProps> = (props) => {
  const [isLoadingExegesis, setIsLoadingExegesis] = useState<boolean>(false);
  const selectedVerse = useStore((state) => state.selectedVerse);
  const { book, chapter, verseNumber, verse, setExegesis } = useBibleStore();
  const navigation =
    useNavigation<StackNavigationProp<{ Exegesis: {}; Bible: {} }>>();
  const handleOutsideClick = () => {
    Keyboard.dismiss();
    props.onClose();
  };

  const goDeeper = async () => {
    try {
      setIsLoadingExegesis(true);
      const userId = auth.currentUser?.uid;

      const response = await fetch(`${API_URL}/getExegesis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          book,
          chapter,
          verseNumber: verseNumber,
          verse: verse,
        }),
      });

      const data = await response.json();
      setExegesis(data.response);

      navigation.navigate("Exegesis", {});
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoadingExegesis(false);
      props.onClose();
    }
    navigation.navigate("Exegesis", {});
  };

  const goToChapter = () => {
    props.onClose();
    logGoToChapter(selectedVerse);
    navigation.navigate("Bible", {});
  };

  return (
    <Modal
      visible={props.isModalVisible}
      animationType="fade"
      transparent={true}
      presentationStyle="overFullScreen"
      onRequestClose={props.onClose}
    >
      <View style={styles.modal}>
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
          <View style={styles.background}></View>
        </TouchableWithoutFeedback>
        <View style={styles.card}>
          <Text style={styles.header}>
            {props.verse?.split('" (')[1].replace(`)`, "")}
          </Text>
          <Text style={styles.highlight}>
            {props.verse?.split('" (')[0].replace(`"`, "")}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={goToChapter}>
            <Text style={styles.closeButtonText}>Go to Chapter</Text>
          </TouchableOpacity>
          {isLoadingExegesis ? (
            <View style={styles.button}>
              <ActivityIndicator color={colors.blue} />
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={goDeeper}>
              <Text style={styles.buttonText}>Go Deeper</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  background: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  card: {
    padding: 24,
    marginHorizontal: 12,
    background: "white",
    borderRadius: 12,
    backgroundColor: "white",
    minWidth: "75%",
  },

  button: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  closeButton: {
    borderColor: colors.blue,
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 17,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 12,
    marginTop: 48,
  },
  closeButtonText: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 18,
  },
  highlight: {
    // backgroundColor: "#fff3a8",
    fontWeight: "500",
    fontFamily: "Baskerville",
    fontSize: 18,
    color: "#333",
    lineHeight: 28,
    marginBottom: 12,
  },
  header: {
    // fontFamily: "Baskerville",
    fontSize: 14,
    color: "#888",
    fontWeight: "700",
    marginBottom: 6,
  },
});

export default VerseActionModal;
