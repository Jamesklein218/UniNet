import React, {useState} from 'react';
import {RefreshControl, View, Animated} from 'react-native';
import {BaseStyle, useTheme, Images} from '@config';
import {SafeAreaView, MaterialItem, FilterSort} from '@components';
import {material} from '@data';

export default function MaterialTab(props) {
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const scrollAnim = new Animated.Value(0);

  const renderContent = () => {
    return (
      <View style={{flex: 1}}>
        <Animated.FlatList
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: scrollAnim,
                  },
                },
              },
            ],
            {useNativeDriver: true},
          )}
          data={material}
          key={'block'}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => (
            <MaterialItem
              block
              image={item.image}
              name={item.name}
              location={item.location}
              price={item.price}
              available={item.available}
              rate={item.rate}
              rateStatus={item.rateStatus}
              numReviews={item.numReviews}
              files={item.files}
              services={item.services}
              style={{
                marginBottom: 10,
              }}
              onPress={() => props.navigation.navigate('MaterialDetail', item)}
              onPressTag={() => props.navigation.navigate('Preview')}
            />
          )}
        />
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        {renderContent()}
      </SafeAreaView>
    </View>
  );
}
