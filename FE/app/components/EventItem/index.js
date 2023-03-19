import React from 'react';
import {View, TouchableOpacity, Dimensions} from 'react-native';
import {Image, Text, Icon, Tag, ProfileGroupSmall} from '@components';
import {BaseColor, Images, useTheme} from '@config';
import PropTypes from 'prop-types';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import * as Utils from '@utils';

const WIDTH = Dimensions.get('window').width;

export default function EventItem(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {
    grid,
    block,
    style,
    image,
    title,
    location,
    eventType,
    eventStart,
    dayLeft,
    description,
    slot,
    liked,
    participant,
    isUrgent,
    onPress,
  } = props;
  /**
   * Display event item as block
   */
  const renderBlock = () => {
    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image source={image} style={styles.blockImage} />
          {isUrgent ? (
            <Tag status style={styles.tagStatus}>
              {t('urgent')}
            </Tag>
          ) : null}
          {/* <Icon
            name="heart"
            solid={liked}
            color={liked ? colors.primaryLight : BaseColor.whiteColor}
            size={24}
            style={styles.iconLike}
          /> */}
        </TouchableOpacity>
        <View style={styles.blockContent}>
          <View style={styles.blockLineMap}>
            <Icon
              name="map-marker-alt"
              color={BaseColor.grayColor}
              size={12}
              style={{marginRight: 3}}
            />
            <Text caption1 grayColor>
              {location}
            </Text>
          </View>
          <Text title2 semibold numberOfLines={1} style={{marginTop: 5}}>
            {title}
          </Text>
          <View style={styles.blockContentStatus}>
            <Text
              body2
              grayColor
              numberOfLines={2}
              style={{
                width: WIDTH * 0.6,
                textDecorationStyle: 'solid',
              }}>
              {description}
            </Text>
            <Text body2 semibold grayColor>
              {eventStart}
            </Text>
          </View>
          <View style={styles.blockContentPrice}>
            <Text title3 semibold primaryColor>
              {dayLeft} {t('days_left')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name="bookmark"
                color={colors.accent}
                size={12}
                solid
                style={{marginRight: 5}}
              />
              <Text caption1 grayColor>
                {eventType == 0 ? t('normal') : t('chain')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Display event item as list
   */
  const renderList = () => {
    return (
      <TouchableOpacity
        style={[styles.listContent, {backgroundColor: colors.card}, style]}
        onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {isUrgent ? <Tag rateSmall>{t('urgent')}</Tag> : null}
          {/* <Icon
            name="heart"
            solid={liked}
            color={liked ? colors.primaryLight : BaseColor.whiteColor}
            size={18}
          /> */}
        </View>
        <Text headline semibold numberOfLines={1} style={{marginVertical: 5}}>
          {title}
        </Text>
        <View style={styles.listLineMap}>
          <Icon
            name="map-marker-alt"
            color={BaseColor.grayColor}
            size={12}
            style={{marginRight: 5}}
          />
          <Text caption1 grayColor>
            {location}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Icon
            name="calendar-alt"
            color={BaseColor.grayColor}
            solid
            size={16}
          />
          <Text caption1 grayColor style={{marginLeft: 5}}>
            {eventStart}
          </Text>
        </View>
        <View style={styles.listRow}>
          <View style={{alignItems: 'flex-start'}}>
            <Text
              body2
              grayColor
              numberOfLines={2}
              style={{
                textDecorationStyle: 'solid',
                width: WIDTH * 0.5,
              }}>
              {description}
            </Text>
            <Text title3 semibold primaryColor>
              {dayLeft} {t('days_left')}
            </Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            {participant.length > 1 ? (
              <ProfileGroupSmall
                users={[
                  {
                    image: {
                      uri: Utils.getMediaURL(
                        participant[0].userInfo.profilePicture.thumbnail,
                      ),
                    },
                  },
                  {
                    image: {
                      uri: Utils.getMediaURL(
                        participant[1].userInfo.profilePicture.thumbnail,
                      ),
                    },
                  },
                ]}
                counter={participant.length}
              />
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Icon
                name="bookmark"
                color={colors.accent}
                size={12}
                solid
                style={{marginRight: 5}}
              />
              <Text caption1 grayColor>
                {eventType == 0 ? t('normal') : t('chain')}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Display event item as grid
   */
  const renderGrid = () => {
    return (
      <View style={[styles.girdContent, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image source={image} style={styles.girdImage} />
          {isUrgent ? (
            <Tag status style={styles.tagGirdStatus}>
              {t('urgent')}
            </Tag>
          ) : null}
          {/* <Icon
            name="heart"
            solid={liked}
            color={liked ? colors.primaryLight : BaseColor.whiteColor}
            size={18}
            style={styles.iconGirdLike}
          /> */}
        </TouchableOpacity>

        <Text subhead semibold style={{marginTop: 5}} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.girdRowRate}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              footnote
              semibold
              grayColor
              style={{marginTop: 5}}
              numberOfLines={1}>
              {eventStart}
            </Text>
          </View>
          <Text caption2 grayColor numberOfLines={1}>
            {dayLeft} {t('days_left')}
          </Text>
        </View>
      </View>
    );
  };

  if (grid) {
    return renderGrid();
  } else if (block) {
    return renderBlock();
  } else {
    return renderList();
  }
}

EventItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  list: PropTypes.bool,
  block: PropTypes.bool,
  grid: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  location: PropTypes.string,
  eventType: PropTypes.number,
  eventStart: PropTypes.string,
  socialDay: PropTypes.number,
  slot: PropTypes.number,
  liked: PropTypes.bool,
  isUrgent: PropTypes.bool,
  onPress: PropTypes.func,
  onPressTag: PropTypes.func,
};

EventItem.defaultProps = {
  style: {},
  image: Images.event5,
  list: true,
  block: false,
  grid: false,
  title: '',
  description: '',
  location: '',
  eventType: 0,
  eventStart: '',
  liked: true,
  slot: 0,
  isUrgent: false,
  onPress: () => {},
  onPressTag: () => {},
};
