import { Ionicons } from "@expo/vector-icons";
import { Loading } from "@src/components/Loading";
import { Container } from "@src/components/ui/Container";
import { VersesList } from "@src/components/VersesList";
import { API_URL } from "@src/constants";
import colors from "@src/styles/colors";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const PER_PAGE = 10;

export const BibleSearchScreen = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async (page: number) => {
    if (!!totalPages && page > totalPages) {
      return;
    }
    setCurrentPage(page);
    if (page === 1) {
      setLoading(true);
      setVerses([]);
    }
    try {
      const response = await fetch(`${API_URL}/searchBible`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, page, perPage: PER_PAGE }),
      });
      const json = await response.json();
      // Set total pages to json.found / PER_PAGE, rounded up
      setTotalPages(Math.ceil(json.found / PER_PAGE));
      const newVerses = json.results.results[0].hits.map((hit: any) => {
        return {
          book: hit.document.book,
          chapter: parseInt(hit.document.chapter),
          verseNumber: parseInt(hit.document.verse),
          verse: hit.document.text,
        };
      });
      setVerses((prevVerses) => [...prevVerses, ...newVerses]);
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
  };

  const handleEndReached = () => {
    if (!currentPage) {
      throw new Error("currentPage is null");
    }
    search(currentPage + 1);
  };

  const startSearch = () => {
    search(1);
  };

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
            onSubmitEditing={startSearch}
          />
        </View>
        <TouchableOpacity disabled={loading} onPress={startSearch}>
          <Text style={styles.searchButton}>Search</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Loading />
      ) : (
        <VersesList
          verses={verses}
          refreshing={false}
          onRefresh={() => {}}
          handleEndReached={handleEndReached}
        />
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
