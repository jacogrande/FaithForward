import { formatVerse } from "@src/components/DevotionalCard";
import LoadingMessages from "@src/components/LoadingMessages";
import VerseActionModal from "@src/components/VerseActionModal";
import useStore from "@src/store";
import colors from "@src/styles/colors";
import { getVerseRef } from "@src/utils";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ViewShot from "react-native-view-shot";

const VerseContainer: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  let devotional = useStore((state) => state.devotional);
  const verseRef = useRef<ViewShot | null>(null);
  const { input, selectedVerse, setSelectedVerse } = useStore();
  const [sharing, setSharing] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleVersePress = (pressedVerse: string) => {
    const verseRef = getVerseRef(pressedVerse, devotional);
    setSelectedVerse(`${pressedVerse} (${verseRef})`);
    setModalOpen(true);
  };

  const closeVerseModal = () => setModalOpen(false);

  const share = async () => {
    setSharing(true);
  };

  useEffect(() => {
    if (sharing) {
      const asyncShare = async () => {
        if (!verseRef.current || !verseRef.current.capture) return;
        try {
          const imageUri = await verseRef.current.capture();
          await Share.share({
            url: imageUri,
          });
        } catch (err) {
          console.error(err);
        } finally {
          setSharing(false);
        }
      };
      setTimeout(() => {
        asyncShare();
      }, 100);
    }
  }, [sharing]);

  return (
    <View style={styles.verse}>
      <ScrollView style={{ paddingTop: 24, backgroundColor: colors.paper }}>
        {devotional && (
          <View style={{ alignItems: "center" }}>
            <View
              style={{ alignItems: "center", backgroundColor: colors.paper }}
            >
              <Text style={styles.response}>
                {formatVerse(devotional, handleVersePress)}
              </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={share}>
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
            <ViewShot ref={verseRef} style={styles.screenshot}>
              <Text style={styles.prompt}>
                <Text style={styles.bold}>Me: </Text>
                {input}
              </Text>
              <Text style={styles.response}>
                <Text style={styles.bold}>Faith Forward: </Text>
                {formatVerse(devotional, handleVersePress)}
              </Text>
            </ViewShot>
          </View>
        )}
        {isLoading && <LoadingMessages />}
      </ScrollView>
      <VerseActionModal
        isModalVisible={modalOpen}
        verse={selectedVerse}
        onClose={closeVerseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  response: {
    fontSize: 16,
    paddingHorizontal: "10%",
    paddingBottom: 36,
    paddingTop: 8,
    color: "#333",
    lineHeight: 28,
  },
  verse: {
    width: "100%",
    alignItems: "center",
    backgroundColor: colors.paper,
  },
  button: {
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginTop: 12,
    alignItems: "center",
    zIndex: 1,
  },
  buttonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "bold",
  },
  prompt: {
    fontSize: 16,
    color: "#333",
    marginTop: 24,
    paddingHorizontal: "10%",
  },

  bold: {
    fontWeight: "700",
    color: "#111",
  },

  screenshot: {
    position: "absolute",
    top: -100000,
    left: 0,
    zIndex: -2,
    alignItems: "flex-start",
    backgroundColor: colors.paper,
  },
  highlight: {
    backgroundColor: "#fff3a8",
    fontWeight: "600",
    fontFamily: "Baskerville",
  },
});

export default VerseContainer;
