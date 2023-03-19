import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Image, Text, Icon, Tag, ProfileDetail} from '@components';
import {useTheme, Images} from '@config';
import PropTypes from 'prop-types';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import * as Utils from '@utils';
import {UserData} from '@data';
export default function VerificationItem(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {
    block,
    grid,
    style,
    image,
    author,
    onPress,
    onPressUser,
    onPressVerify,
    status,
    createdAt,
    isUrgent,
    title,
  } = props;

  /**
   * Display Tour item as block
   */
  const renderBlock = () => {
    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image resizeMode="cover" source={image} style={styles.blockImage} />
          <View
            style={[
              styles.blockPriceContent,
              {backgroundColor: colors.primary},
            ]}>
            <Text title3 whiteColor semibold>
              {status}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{marginTop: 5, paddingHorizontal: 20}}>
          <ProfileDetail
            image={
              // {uri: Utils.getMediaURL(author.profilePicture.thumbnail)}
              UserData[2].image
            }
            textFirst={title}
            textSecond={author.name}
            // point={author.point}
            icon={false}
            style={{marginTop: 10}}
            onPress={onPressUser}
          />
          <View style={styles.blockDetailContent}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                caption1
                grayColor
                semibold
                style={{
                  marginLeft: 10,
                  marginRight: 3,
                }}>
                {t('submit_time') + ':'}
              </Text>
              <Text caption1 primaryColor semibold>
                {Utils.formatDate(createdAt) +
                  ' at ' +
                  Utils.formatTime(createdAt)}
              </Text>
            </View>
            {isUrgent ? (
              <Tag outline round style={{height: 30}} onPress={onPressVerify}>
                {t('urgent')}
              </Tag>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  /**
   * Display Tour item as list
   */

  /**
   * Display Tour item as grid
   */
  const renderGrid = () => {
    return (
      <View style={[styles.girdContent, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image source={image} style={styles.girdImage} />
        </TouchableOpacity>
        <View style={styles.girdContentLocation}>
          <Icon name="calendar-alt" color={colors.primary} size={10} />
          <Text
            caption2
            grayColor
            style={{
              marginLeft: 3,
            }}>
            {Utils.formatDate(createdAt) + ' at ' + Utils.formatTime(createdAt)}
          </Text>
        </View>
        <Text
          body2
          semibold
          style={{
            marginTop: 5,
          }}
          numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.girdContentRate}>
          <Text caption1 accentColor>
            {author.name}
          </Text>
        </View>
        <Text
          title3
          primaryColor
          semibold
          style={{
            marginTop: 5,
          }}>
          {status}
        </Text>
      </View>
    );
  };

  if (grid) {
    return renderGrid();
  } else {
    return renderBlock();
  }
}

VerificationItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  block: PropTypes.bool,
  grid: PropTypes.bool,
  image: PropTypes.node.isRequired,
  author: PropTypes.object,
  services: PropTypes.array,
  onPress: PropTypes.func,
  onPressVerify: PropTypes.func,
  status: PropTypes.string,
  title: PropTypes.string,
  isUrgent: PropTypes.bool,
  createdAt: PropTypes.number,
};

VerificationItem.defaultProps = {
  style: {},
  block: false,
  grid: false,
  image: Images.event4,
  author: {},
  services: [],
  status: '',
  title: '',
  createdAt: 0,
  isUrgent: false,
  onPress: () => {},
  onPressVerify: () => {},
  onPressUser: () => {},
};
