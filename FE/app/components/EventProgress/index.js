import React from "react";
import { TouchableOpacity } from "react-native";
import styles from "./styles";
import { Text } from "@components";
import PropTypes from "prop-types";
import { useTheme } from "@config";

export default function EventProgress(props) {
  const { colors } = useTheme();
  const { style, onPress, step, title, description, disable } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, { backgroundColor: colors.card }, style]}
      onPress={onPress}
      disabled={disable}
      activeOpacity={0.9}
    >
      {disable ?
      (
        <>
          <Text headline grayColor semibold>
            {step}
          </Text>
          <Text
            title3 grayColor
            style={{
              marginTop: 8
            }}
          >
            {title}
          </Text>
          <Text
            body2
            grayColor
            semibold
            style={{
              marginTop: 8
            }}
            numberOfLines={5}
          >
            {description}
          </Text>
        </>
      )
      :
      (<>
        <Text headline primaryColor semibold>
          {step}
        </Text>
        <Text
          title3
          semibold
          style={{
            marginTop: 8
          }}
        >
          {title}
        </Text>
        <Text
          body2
          style={{
            marginTop: 8
          }}
          numberOfLines={5}
        >
          {description}
        </Text>
      </>
      )}
    </TouchableOpacity>
  );
}

EventProgress.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onPress: PropTypes.func,
  step: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string
};

EventProgress.defaultProps = {
  step: "",
  title: "",
  description: "",
  style: {},
  onPress: () => {}
};
