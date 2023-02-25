import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import colors from "@src/styles/colors";
import React from "react";
import {
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
  const navigation =
    useNavigation<StackNavigationProp<{ Exegesis: {}; Reader: {} }>>();
  const handleOutsideClick = () => {
    Keyboard.dismiss();
    props.onClose();
  };

  const goDepeer = () => {
    props.onClose();
    navigation.navigate("Exegesis", {});
  };

  const goToChapter = () => {
    props.onClose();
    navigation.navigate("Reader", {});
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
          <TouchableOpacity style={styles.button} onPress={goDepeer}>
            <Text style={styles.buttonText}>Go Deeper</Text>
          </TouchableOpacity>
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
