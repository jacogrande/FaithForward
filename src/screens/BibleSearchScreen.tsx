import { Ionicons } from "@expo/vector-icons";
import { Loading } from "@src/components/Loading";
import { Container } from "@src/components/ui/Container";
import { VersesList } from "@src/components/VersesList";
import { API_URL } from "@src/constants";
import colors from "@src/styles/colors";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const BibleSearchScreen = () => {
  const [query, setQuery] = useState("");
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async () => {
    if (query.length < 3) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/searchBible`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const json = await response.json();
      setVerses(
        json.hits.map((hit: any) => {
          return {
            book: hit.document.book,
            chapter: parseInt(hit.document.chapter),
            verseNumber: parseInt(hit.document.verse),
            verse: hit.document.text,
          };
        })
      );
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
  }, []);

  const handleSearch = useCallback(() => {
    search();
  }, [search]);

  return (
    <Container>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="ios-search"
            size={24}
            color={colors.text}
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search the Bible"
            placeholderTextColor={colors.placeholderText}
            style={styles.searchInput}
            onChangeText={handleQueryChange}
            value={query}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity disabled={loading} onPress={handleSearch}>
          <Text style={styles.searchButton}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Loading />
      ) : (
        <VersesList verses={verses} refreshing={false} onRefresh={() => {}} />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkPaper,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
  },
  searchButton: {
    fontSize: 16,
    color: colors.blue,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContentContainer: {},
  result: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    color: colors.black,
  },
});
