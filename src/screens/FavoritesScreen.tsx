import { FavoritesFilters } from "@src/components/FavoritesFilters";
import { FavoritesList } from "@src/components/FavoritesList";
import { Container } from "@src/components/ui/Container";
import { FaveViewType } from "@src/types";
import React, { useState } from "react";
import { View } from "react-native";

export default function FavoritesScreen() {
  const [viewType, setViewType] = useState<FaveViewType>("devos");

  function handleFilterPress(pressedViewType: FaveViewType): void {
    switch (pressedViewType) {
      case "devos":
        setViewType("devos");
        break;
      case "sermons":
        setViewType("sermons");
        break;
      case "verses":
        setViewType("verses");
        break;
      case "exegeses":
        setViewType("exegeses");
        break;
      default:
        throw new Error("Unrecognized view type pressed");
    }
  }

  return (
    <Container>
      <View className="flex-1">
        <FavoritesFilters
          viewType={viewType}
          onPressFilter={handleFilterPress}
        />
        <FavoritesList viewType={viewType} />
      </View>
    </Container>
  );
}
