import React from "react";
import { TouchableOpacity } from "react-native";

export function BigButton({
  onPress,
  isLoading,
  disabled,
  children,
}: {
  onPress: () => void;
  isLoading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ opacity: isLoading ? 0.5 : 1 }}
      className={`w-4/5 p-4 rounded bg-ffBlue items-center justify-center self-center`}
      disabled={disabled}
    >
      {children}
    </TouchableOpacity>
  );
}
