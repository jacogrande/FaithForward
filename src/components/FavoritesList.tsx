import { FavoriteDevos } from "@src/components/FavoriteDevos";
import { FavoriteExegeses } from "@src/components/FavoriteExegeses";
import { FavoriteSermons } from "@src/components/FavoriteSermons";
import { FavoriteVerses } from "@src/components/FavoriteVerses";
import BaseText from "@src/components/ui/BaseText";
import { auth } from "@src/firebase";
import { FaveViewType } from "@src/types";
import React from "react";
import { View } from "react-native";

export function FavoritesList({ viewType }: { viewType: FaveViewType }) {
  if (auth.currentUser?.isAnonymous) {
    return (
      <View className="flex-1 my-5 mx-7">
        <BaseText className="text-ffGrey italic">
          You must have an account to save favorites.
        </BaseText>
      </View>
    );
  }

  switch (viewType) {
    case "devos":
      return <FavoriteDevos />;
    case "sermons":
      return <FavoriteSermons />;
    case "verses":
      return <FavoriteVerses />;
    case "exegeses":
      return <FavoriteExegeses />;
    default:
      return (
        <View className="flex-1 my-5 mx-7">
          <BaseText className="text-ffGrey italic">
            Oops, something went wrong. Please try again.
          </BaseText>
        </View>
      );
  }
}
