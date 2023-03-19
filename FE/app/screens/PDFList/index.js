import React, {useState} from 'react';
import {FlatList, RefreshControl, ActivityIndicator, View} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Coupon} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';
import {CouponsData} from '@data';

export default function Coupons({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [refreshing] = useState(false);
  const [coupons] = useState(CouponsData);

  /**
   * @description Loading booking item history one by one
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @returns
   */
  const renderItem = (item, index) => {
    return (
      <Coupon
        style={{
          marginBottom: 15,
          marginHorizontal: 20,
        }}
        name={`Văn Kiện`}
        // code={`Mẫu ${index + 1}`}
        description={item.name}
        // valid={item.valid}
        // remain={item.remain}
        onPress={() => {
          navigation.navigate('PDF', {_id: index});
        }}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('document')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        // renderRight={() => {
        //   if (loading) {
        //     return <ActivityIndicator size="small" color={colors.primary} />;
        //   } else {
        //     return (
        //       <Text headline primaryColor numberOfLines={1}>
        //         {t('save')}
        //       </Text>
        //     );
        //   }
        // }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          setLoading(true);
          setTimeout(() => {
            navigation.goBack();
          }, 500);
        }}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <FlatList
          contentContainerStyle={{paddingTop: 15}}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {}}
            />
          }
          data={[
            {name: 'Chương trình Đại hội'},
            {name: 'Quy chế làm việc Đại hội'},
            {
              name: 'Dự thảo Báo cáo Tổng kết công tác Đoàn và phong trào thanh niên Đoàn khối VPĐTQT nhiệm kỳ 2019 - 2022 ',
            },
            {
              name: 'Dự thảo Bản tự kiểm điểm Ban Chấp hành Đoàn khối VPĐTQT nhiệm kỳ 2019 - 2022',
            },
            {
              name: 'Dự thảo Phương hướng và Nhiệm vụ nhiệm kỳ của Đoàn khối VPĐTQT nhiệm kỳ 2022 - 2024',
            },
          ]}
          keyExtractor={(item, index) => item.id}
          renderItem={({item, index}) => renderItem(item, index)}
        />
      </SafeAreaView>
    </View>
  );
}
