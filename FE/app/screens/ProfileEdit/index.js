import React, {useState} from 'react';
import {View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
  EventTypeOption,
} from '@components';
import styles from './styles';
import {UserData} from '@data';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {AuthActions} from '@actions';
import {BaseColor} from '@config';

export default function ProfileEdit({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const profile = useSelector(state => state.auth.profile);
  const dispatch = useDispatch();
  console.log('f', profile);
  const [id, setId] = useState(profile._id);
  const [name, setName] = useState(profile.username);
  const [email, setEmail] = useState(profile.email);
  const [address, setAddress] = useState(profile.address);
  const [description, setDescription] = useState(profile.description);
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [gender, setGender] = useState(
    profile.gender ? profile.gender : 'MALE',
  );
  const [classId, setClassId] = useState(profile.classId);
  const [major, setMajor] = useState(profile.major);
  const [phone, setPhone] = useState(profile.phone);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [image] = useState(UserData[0].image);
  const [loading, setLoading] = useState(false);

  return (
    <View style={{flex: 1}}>
      <Header
        title={t('edit_profile')}
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
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {}}
      />
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.contain}>
            <View>
              <Image source={image} style={styles.thumb} />
            </View>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('account')}
              </Text>
            </View>
            {}
            <Text
              style={{
                height: 46,
                borderRadius: 5,
                padding: 10,
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: BaseColor.grayColor,
                color: 'white',
              }}>
              {id}
            </Text>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('name')}
              </Text>
            </View>
            <Text
              style={{
                height: 46,
                borderRadius: 5,
                padding: 10,
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: BaseColor.grayColor,
                color: 'white',
              }}>
              {name}
            </Text>
            <View style={{marginTop: 10, width: '100%', marginBottom: 5}}>
              <EventTypeOption
                label={t('gender')}
                option={[
                  {value: 'MALE', text: 'Male'},
                  {value: 'FEMALE', text: 'Female'},
                  {value: 'OTHERS', text: 'Others'},
                ]}
                onChange={value => setGender(value)}
                value={gender}
              />
            </View>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('email')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setEmail(text)}
              placeholder={t('input_email')}
              value={email}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('address')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setAddress(text)}
              placeholder={t('input_address')}
              value={address}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('description')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setDescription(text)}
              placeholder={t('input_description')}
              value={description}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('first_name')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setFirstName(text)}
              placeholder={t('input_first_name')}
              value={firstName}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('last_name')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setLastName(text)}
              placeholder={t('input_last_name')}
              value={lastName}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('class_id')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setClassId(text)}
              placeholder={t('input_class_id')}
              value={classId}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('major')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setMajor(text)}
              placeholder={t('input_major')}
              value={major}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('phone')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setPhone(text)}
              placeholder={t('input_phone')}
              value={phone}
            />
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('student_id')}
              </Text>
            </View>
            <TextInput
              onChangeText={text => setStudentId(text)}
              placeholder={t('input_student_id')}
              value={studentId}
            />
          </ScrollView>
          <View style={{paddingVertical: 15, paddingHorizontal: 20}}>
            <Button
              loading={loading}
              full
              onPress={() => {
                setLoading(true);
                const data = {
                  name,
                  email,
                  gender,
                  address,
                  description,
                  firstName,
                  lastName,
                  classId,
                  major,
                  phone,
                  studentId,
                };
                dispatch(AuthActions.updateProfile(data))
                  .then(e => {
                    navigation.goBack();
                  })
                  .catch(e => {
                    // navigation.goBack();
                    setLoading(false);
                    console.log(e);
                  });
              }}>
              {t('confirm')}
            </Button>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
