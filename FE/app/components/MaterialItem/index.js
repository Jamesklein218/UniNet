import React from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import {Image, Text, Icon, StarRating, Tag, ProfileAuthor} from '@components';
import {BaseColor, useTheme, Images} from '@config';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import MM from '../../assets/images/mm.png';
export default function MaterialItem(props) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const {
    block,
    grid,
    style,
    image,
    name,
    author,
    location,
    price,
    available,
    rate,
    onPress,
    services,
    rateCount,
    title,
    numReviews,
  } = props;

  const renderBlock = () => {
    return (
      <View style={style}>
        <ProfileAuthor
          image={author}
          name={title}
          username={title.toLowerCase()}
          style={{paddingHorizontal: 20}}
        />
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.9}
          style={{
            flex: 1,
            minWidth: 200,
            minHeight: 200,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image style={styles.imagePost} source={image} />
        </TouchableOpacity>
        <View style={{paddingHorizontal: 20}}>
          <Text title2 semibold style={{marginTop: 5}} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.blockContentDetail}>{/* TODO */}</View>
        </View>
        <View style={styles.contentService}>
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={services}
            keyExtractor={(item, index) => item.id}
            renderItem={({item, index}) => (
              <Tag
                key={'materialTabItem' + `${index}`}
                outline={true}
                primary={false}
                round
                style={{marginHorizontal: 20}}>
                {item.name}
              </Tag>
            )}
          />
          <TouchableOpacity
            style={{
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingHorizontal: 12,
            }}>
            <Icon name="angle-right" size={16} color={BaseColor.dividerColor} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * Display hotel item as list
   */
  const renderList = () => {
    return (
      <View style={[styles.listContent, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image source={image} style={styles.listImage} />
        </TouchableOpacity>
        <View style={styles.listContentRight}>
          <Text headline semibold numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.listContentRow}>
            <Icon name="map-marker-alt" color={colors.primaryLight} size={10} />
            <Text
              caption1
              grayColor
              style={{
                marginLeft: 3,
              }}
              numberOfLines={1}>
              {location}
            </Text>
          </View>
          <View style={styles.listContentRow}>
            <StarRating
              disabled={true}
              starSize={10}
              maxStars={5}
              rating={rate}
              selectedStar={rating => {}}
              fullStarColor={BaseColor.yellowColor}
            />
            <Text
              caption1
              grayColor
              semibold
              style={{
                marginLeft: 10,
                marginRight: 3,
              }}>
              {t('rating')}
            </Text>
            <Text caption1 primaryColor semibold>
              {rateCount}
            </Text>
          </View>
          <Text
            title3
            primaryColor
            semibold
            style={{marginTop: 5, marginBottom: 5}}>
            {price}
          </Text>
          <Text caption1 semibold>
            {t('avg_night')}
          </Text>
          <Text footnote accentColor style={{marginTop: 3}}>
            {available}
          </Text>
        </View>
      </View>
    );
  };

  /**
   * Display hotel item as grid
   */
  const renderGrid = () => {
    return (
      <View style={[styles.girdContent, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Image source={image} style={styles.girdImage} />
        </TouchableOpacity>
        <View style={styles.girdContentLocation}>
          <Icon name="map-marker-alt" color={colors.primary} size={10} />
          <Text
            caption2
            grayColor
            style={{
              marginHorizontal: 5,
            }}
            numberOfLines={1}>
            {location}
          </Text>
        </View>
        <Text
          body2
          semibold
          style={{
            marginTop: 5,
          }}>
          {name}
        </Text>
        <View style={styles.girdContentRate}>
          <StarRating
            disabled={true}
            starSize={10}
            maxStars={5}
            rating={rate}
            selectedStar={rating => {}}
            fullStarColor={BaseColor.yellowColor}
          />
          <Text caption2 grayColor>
            {numReviews} {t('reviews')}
          </Text>
        </View>
        <Text
          title3
          primaryColor
          semibold
          style={{
            marginTop: 5,
          }}>
          {price}
        </Text>
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

MaterialItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  list: PropTypes.bool,
  block: PropTypes.bool,
  grid: PropTypes.bool,
  name: PropTypes.string,
  location: PropTypes.string,
  price: PropTypes.string,
  available: PropTypes.string,
  rate: PropTypes.number,
  rateCount: PropTypes.string,
  rateStatus: PropTypes.string,
  numReviews: PropTypes.number,
  services: PropTypes.array,
  onPress: PropTypes.func,
  onPressTag: PropTypes.func,
};

MaterialItem.defaultProps = {
  style: {},
  image: '',
  list: true,
  block: false,
  grid: false,
  name: '',
  location: '',
  price: '',
  available: '',
  rate: 0,
  rateCount: '',
  rateStatus: '',
  numReviews: 0,
  services: [],
  onPress: () => {},
  onPressTag: () => {},
};
