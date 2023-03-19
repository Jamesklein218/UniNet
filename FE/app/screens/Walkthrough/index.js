import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {AuthActions} from '@actions';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView, Text, Button, Image} from '@components';
import styles from './styles';
import Swiper from 'react-native-swiper';
import {BaseColor, BaseStyle, Images, useTheme} from '@config';
import * as Utils from '@utils';
import {useTranslation} from 'react-i18next';

export default function Walkthrough({navigation}) {
  const [loading, setLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [slide] = useState([
    {key: 3, image: Images.logo},
    {key: 2, image: Images.cover3},
  ]);
  const {colors} = useTheme();
  const {t} = useTranslation();

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'left', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.contain}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }>
        <View style={styles.wrapper}>
          {/* Images Swiper */}
          <Swiper
            dotStyle={{
              backgroundColor: BaseColor.dividerColor,
            }}
            autoplay
            activeDotColor={colors.primary}
            paginationStyle={styles.contentPage}
            removeClippedSubviews={false}>
            {slide.map((item, index) => {
              return (
                <View style={styles.slide} key={item.key}>
                  <Image source={item.image} style={styles.img} />
                  {/* <Text body1 style={styles.textSlide}>
                    {t('pick_your_destication')}
                  </Text> */}
                </View>
              );
            })}
          </Swiper>
        </View>
        <View style={{width: '100%'}}>
          {/* <Button
            full
            style={{
              backgroundColor: BaseColor.navyBlue,
              marginTop: 20,
            }}
            onPress={() => {
              // authentication();
            }}>
            {t('login_facebook')}
          </Button> */}
          <Button
            full
            style={{marginTop: 20}}
            loading={loading}
            onPress={() => navigation.navigate('SignIn')}>
            {t('sign_in')}
          </Button>
          {/* <View style={styles.contentActionBottom}>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text body1 grayColor>
                {t('not_have_account')}
              </Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
