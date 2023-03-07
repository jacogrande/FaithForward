import React from "react";
import { Text, TextProps } from "react-native";

type SmallTextProps = TextProps & {
  children: React.ReactNode;
};

const SmallText: React.FC<SmallTextProps> = ({ children, ...rest }) => {
  return (
    <Text className="text-sm color-ffGrey" {...rest}>
      {children}
    </Text>
  );
};

export default SmallText;
