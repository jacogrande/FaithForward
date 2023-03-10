import { Ionicons } from "@expo/vector-icons";
import { Container } from "@src/components/ui/Container";
import { VerseCard } from "@src/components/VerseCard";
import { API_URL } from "@src/constants";
import colors from "@src/styles/colors";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const BibleSearchScreen = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);

  console.debug("BibleSearchScreen");
  console.debug("query", query);
  console.debug("results", results);
  console.debug("loading", loading);
  console.debug("error", error);
  console.debug("searched", searched);
  console.debug("verses:", verses)
  console.debug("***********************");

  const search = useCallback(async () => {
    if (query.length < 3) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/searchBible?query=${query}`, {
        method: "POST",
      });
      const json = await response.json();
      setResults(json);
      setVerses(
        json.hits.map((hit: any) => {
          return {
            book: hit.document.book,
            chapter: hit.document.chapter,
            verse: hit.document.verse,
            text: hit.document.text,
          };
        })
      );
    } catch (e) {
      setError(true);
      setLoading(false);
    } finally {
      setLoading(false);
      setSearched(true);
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
            placeholderTextColor={colors.text}
            style={styles.searchInput}
            onChangeText={handleQueryChange}
            value={query}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity onPress={handleSearch}>
          <Text style={styles.searchButton}>Search</Text>
        </TouchableOpacity>
      </View>
      {searched && !loading && (
        <ScrollView
          style={styles.resultsContainer}
          contentContainerStyle={styles.resultsContentContainer}
        >
          {verses.map((verse, index) => (
            <VerseCard
              key={index}
              book={verse.book}
              chapter={verse.chapter}
              verseNumber={verse.verse}
              verse={verse.text}
              handleUnfavoritingVerse={() => {}}
            />
          ))}
        </ScrollView>
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
  resultsContentContainer: {
    padding: 16,
  },
  result: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    color: colors.black,
  },
});
