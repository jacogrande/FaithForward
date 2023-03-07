import React from "react";
import { Text, TextProps } from "react-native";

type BaseTextProps = TextProps & {
  children: React.ReactNode;
};

const BaseText: React.FC<BaseTextProps> = ({ children, ...rest }) => {
  return (
    <Text className="text-base leading-7 color-ffText " {...rest}>
      {children}
    </Text>
  );
};

export default BaseText;
