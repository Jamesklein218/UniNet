import React, {useState} from 'react';
import {
  RefreshControl,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {UserData} from '@data';
import {BaseStyle, BaseColor, useTheme, Images} from '@config';
import {
  Header,
  SafeAreaView,
  ForumItem,
  ProfileAuthor,
  Button,
  TextInput,
  Text,
} from '@components';
import styles from './styles';
import {PostData} from '@data';
import {useTranslation} from 'react-i18next';
import {EventActions} from '@actions';
import {useFocusEffect} from '@react-navigation/native';
import profileimg from '../../assets/images/avata-02.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {ForumAPI} from '@api';
import {AuthActions} from '@actions';
import {GET_ALL_POST} from '../../actions/actionTypes';

export default function ProfileTab({navigation}) {
  const {colors} = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const profile = useSelector(state => state.auth.profile);
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
  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  const [classId, setClassId] = useState(profile.classId);
  const [major, setMajor] = useState(profile.major);
  const [phone, setPhone] = useState(profile.phone);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [loading, setLoading] = useState(false);

  const {posts} = useSelector(state => state.forum);

  const {t} = useTranslation();

  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, []),
  );

  const onLogOut = () => {
    dispatch(AuthActions.logOut());
  };

  const onRefresh = () => {
    setRefreshing(true);
    (async () => {
      try {
        const {data} = await ForumAPI.getAllPost();
        dispatch({
          type: GET_ALL_POST,
          payload: data.payload,
        });
      } catch (err) {
        console.log(err);
      }
      setRefreshing(false);
    })();
  };

  console.log(posts);

  return (
    <View style={{flex: 1, margin: 20}}>
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        edges={['right', 'left', 'bottom']}>
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            keyboardVerticalOffset={offsetKeyboard}
            style={{flex: 1}}>
            <View style={styles.contentTitle}>
              <Text headline semibold>
                {t('account')}
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
            <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
              <Button full loading={loading} onPress={() => onLogOut()}>
                {t('sign_out')}
              </Button>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
