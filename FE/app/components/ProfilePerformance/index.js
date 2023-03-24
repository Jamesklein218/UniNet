import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text, StarRating} from '@components';
import styles from './styles';
import PropTypes from 'prop-types';
import Upvote from '../../assets/svgs/Upvote.svg';
import Downvote from '../../assets/svgs/Downvote.svg';
import {useTheme} from '@config';

export default function ProfilePerformance(props) {
  const renderValue = (type, value) => {
    switch (type) {
      case 'primary':
        return (
          <>
            <StarRating
              disabled={true}
              starSize={10}
              maxStars={5}
              rating={value}
              selectedStar={rating => {}}
              fullStarColor={colors.accent}
            />
            <Text title3 semibold>
              {value}/5
            </Text>
          </>
        );
      case 'small':
        return (
          <>
            <StarRating
              disabled={true}
              starSize={10}
              maxStars={5}
              rating={value}
              selectedStar={rating => {}}
              fullStarColor={colors.accent}
            />
            <Text body1 semibold>
              {value}/5
            </Text>
          </>
        );
      default:
        return (
          <Text headline semibold>
            {value}/5
          </Text>
        );
    }
  };

  const renderTitle = (type, value) => {
    switch (type) {
      case 'primary':
        return (
          <Text body2 grayColor>
            {value}
          </Text>
        );
      case 'small':
        return (
          <Text caption1 grayColor>
            {value}
          </Text>
        );
      default:
        return (
          <Text body2 grayColor>
            {value}
          </Text>
        );
    }
  };

  const {
    style,
    contentLeft,
    contentCenter,
    contentRight,
    data,
    type,
    flexDirection,
    upvoteProps,
    downvoteProps,
  } = props;

  const {colors} = useTheme();
  const [upvote, setUpvote] = useState(upvoteProps);
  const [downvote, setDownvote] = useState(downvoteProps);

  const onPress = typeOfVote => {
    if (type === 'downvote') {
      setDownvote(!downvote);
      setUpvote(false);
    } else {
      setUpvote(!upvote);
      setDownvote(false);
    }
  };

  switch (flexDirection) {
    case 'row':
      return (
        <View style={[styles.contain, style]}>
          {data.map((item, index) => {
            if (index == 0) {
              return (
                <View style={[styles.contentLeft, contentLeft]} key={index}>
                  {renderValue(type, item.value)}
                  {renderTitle(type, item.title)}
                </View>
              );
            } else if (index == data.length - 1) {
              return (
                <View style={[styles.contentRight, contentRight]} key={index}>
                  {renderValue(type, item.value)}
                  {renderTitle(type, item.title)}
                </View>
              );
            } else {
              return (
                <View style={[styles.contentCenter, contentCenter]} key={index}>
                  {renderValue(type, item.value)}
                  {renderTitle(type, item.title)}
                </View>
              );
            }
          })}
        </View>
      );
    case 'column':
      return (
        <View style={[{justifyContent: 'space-between', flex: 1}, style]}>
          {data.map((item, index) => (
            <>
              <View style={styles.itemInfor} key={index}>
                {renderTitle(type, item.title)}
                {renderValue(type, item.value)}
              </View>
            </>
          ))}
        </View>
      );
  }
}

ProfilePerformance.propTypes = {
  flexDirection: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  data: PropTypes.array,
  contentLeft: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentCenter: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentRight: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ProfilePerformance.defaultProps = {
  flexDirection: 'row',
  type: 'medium',
  style: {},
  data: [],
  contentLeft: {},
  contentCenter: {},
  contentRight: {},
};
