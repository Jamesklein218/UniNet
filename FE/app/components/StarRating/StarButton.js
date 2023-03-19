import React from 'react';
import {StyleSheet, ViewPropTypes, TouchableOpacity} from 'react-native';
import {Image} from '@components';
import PropTypes from 'prop-types';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import FoundationIcons from 'react-native-vector-icons/Foundation';
import IoniconsIcons from 'react-native-vector-icons/Ionicons';
import MaterialIconsIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIconsIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OcticonsIcons from 'react-native-vector-icons/Octicons';
import ZocialIcons from 'react-native-vector-icons/Zocial';
import SimpleLineIconsIcons from 'react-native-vector-icons/SimpleLineIcons';

const iconSets = {
  Entypo: EntypoIcons,
  EvilIcons: EvilIconsIcons,
  Feather: FeatherIcons,
  FontAwesome: FontAwesomeIcons,
  Foundation: FoundationIcons,
  Ionicons: IoniconsIcons,
  MaterialIcons: MaterialIconsIcons,
  MaterialCommunityIcons: MaterialCommunityIconsIcons,
  Octicons: OcticonsIcons,
  Zocial: ZocialIcons,
  SimpleLineIcons: SimpleLineIconsIcons,
};

const propTypes = {
  buttonStyle: ViewPropTypes.style,
  disabled: PropTypes.bool.isRequired,
  halfStarEnabled: PropTypes.bool.isRequired,
  icoMoonJson: PropTypes.string,
  iconSet: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  reversed: PropTypes.bool.isRequired,
  starColor: PropTypes.string.isRequired,
  starIconName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]).isRequired,
  starSize: PropTypes.number.isRequired,
  activeOpacity: PropTypes.number.isRequired,
  starStyle: ViewPropTypes.style,
  onStarButtonPress: PropTypes.func.isRequired,
};

const defaultProps = {
  buttonStyle: {},
  icoMoonJson: undefined,
  starStyle: {},
};

function StarButton(props) {
  const {
    halfStarEnabled,
    starSize,
    rating,
    onStarButtonPress,
    icoMoonJson,
    iconSet,
    reversed,
    starColor,
    starIconName,
    starStyle,
    activeOpacity,
    buttonStyle,
    disabled,
  } = props;

  const onButtonPress = event => {
    let addition = 0;

    if (halfStarEnabled) {
      const isHalfSelected = event.nativeEvent.locationX < starSize / 2;
      addition = isHalfSelected ? -0.5 : 0;
    }

    onStarButtonPress(rating + addition);
  };

  const iconSetFromProps = () => {
    if (icoMoonJson) {
      return createIconSetFromIcoMoon(icoMoonJson);
    }

    return iconSets[iconSet];
  };

  const renderIcon = () => {
    const Icon = iconSetFromProps();
    let iconElement;

    const newStarStyle = {
      transform: [
        {
          scaleX: reversed ? -1 : 1,
        },
      ],
      ...StyleSheet.flatten(starStyle),
    };

    if (typeof starIconName === 'string') {
      iconElement = (
        <Icon
          name={starIconName}
          size={starSize}
          color={starColor}
          style={newStarStyle}
        />
      );
    } else {
      const imageStyle = {
        width: starSize,
        height: starSize,
        resizeMode: 'contain',
      };

      const iconStyles = [imageStyle, newStarStyle];

      iconElement = <Image source={starIconName} style={iconStyles} />;
    }

    return iconElement;
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={disabled}
      style={buttonStyle}
      onPress={disabled ? () => {} : onButtonPress}>
      {renderIcon()}
    </TouchableOpacity>
  );
}

StarButton.propTypes = propTypes;
StarButton.defaultProps = defaultProps;

export default StarButton;
