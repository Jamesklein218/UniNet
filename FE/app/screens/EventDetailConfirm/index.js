import React, {useState, useEffect} from 'react';
import {View, ScrollView, RefreshControl} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {Header, SafeAreaView, Icon, Text, Button, TextInput} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {ApplicationActions} from '@actions';
import * as Utils from '@utils';
import _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';

import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {EventActions} from '@actions';

export default function EventDetailConfirm(props) {
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [note, setNote] = useState('');
  const dispatch = useDispatch();
  const {role} = props.route.params;
  const {eventId, event, onRefresh} = props.route.params;
  const [refreshing] = useState(false);
  console.log('EREER', event);
  const me = useSelector(state => state.auth.profile);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = type => {
    EventActions.confirmEvent(eventId, type, note)
      .then(res => {
        console.log('Cofirm Event Leader Report Info successful', res);
        // dispatch(ApplicationActions.onHideLoading());
        onRefresh();
      })
      .catch(err => {
        console.log('Error in Confirm Event Leader Report Info', err);
        // dispatch(ApplicationActions.onHideLoading());
      });
  };

  const renderBottom = () => {
    if (role == 'LEADER') {
      return (
        <View
          style={[styles.contentButtonBottom, {borderTopColor: colors.border}]}>
          <View>
            <Text caption1 semibold grayColor>
              {t('status')}
            </Text>
            <Text title3 primaryColor semibold>
              {/* {event.eventConfirmation.confirmedByLeaderAt
                ? t('confirmed')
                : t('not_confirmed')} */}
              {t('not_confirmed')}
            </Text>
            {!_.isEmpty(event.leaderConfirm) ? (
              <Text caption1 semibold grayColor style={{marginTop: 5}}>
                {/* {t('submit_time') +
                  ': ' +
                  Utils.formatDate(
                    event.eventConfirmation.confirmedByLeaderAt * 1000,
                  ) +
                  ' at ' +
                  Utils.formatTime(
                    event.eventConfirmation.confirmedByLeaderAt * 1000,
                  )} */}
                {t('submit_time') + ': '}
              </Text>
            ) : null}
          </View>
          {/* {event.eventConfirmation.confirmedByLeaderAt ? null : (
            <Button
              onPress={() => {
                dispatch(
                  ApplicationActions.onShowPopupSelection(
                    t('confirm_event_report_popup_selection'),
                    t('cancel'),
                    t('confirm'),
                    () => {},
                    () => {
                      onSubmit(1);
                    },
                  ),
                );
              }}>
              {t('confirm')}
            </Button>
          )} */}
        </View>
      );
    } else if (role == 'CREATORRRR') {
      //Fix lại
      if (
        me._id == event.creatorId &&
        !event.eventConfirmation.confirmedByCreatorAt &&
        event.eventConfirmation.confirmedByLeaderAt
      ) {
        return (
          <View
            style={[
              styles.contentButtonBottom,
              {borderTopColor: colors.border},
            ]}>
            <View>
              <Text caption1 semibold grayColor>
                {t('status')}
              </Text>
              <Text title3 primaryColor semibold>
                {event.eventConfirmation.confirmedByCreatorAt
                  ? t('confirmed')
                  : t('not_confirmed')}
              </Text>
              {!_.isEmpty(event.creatorConfirm) ? (
                <Text caption1 semibold grayColor style={{marginTop: 5}}>
                  {t('submit_time') +
                    ': ' +
                    Utils.formatDate(
                      event.eventConfirmation.confirmedByCreatorAt * 1000,
                    ) +
                    ' at ' +
                    Utils.formatTime(
                      event.eventConfirmation.confirmedByCreatorAt * 1000,
                    )}
                </Text>
              ) : null}
            </View>
            {event.eventConfirmation.confirmedByCreatorAt ? null : (
              <Button
                onPress={() => {
                  dispatch(
                    ApplicationActions.onShowPopupSelection(
                      t('confirm_event_report_popup_selection'),
                      t('cancel'),
                      t('confirm'),
                      () => {},
                      () => {
                        onSubmit(2);
                      },
                    ),
                  );
                }}>
                {t('confirm')}
              </Button>
            )}
          </View>
        );
      }
    } else if (false) {
      if (
        me._id == event.eventVerification.verifiedBy &&
        event.eventConfirmation.confirmedByCreatorAt &&
        event.eventConfirmation.confirmedByLeaderAt
      ) {
        return (
          <View
            style={[
              styles.contentButtonBottom,
              {borderTopColor: colors.border},
            ]}>
            <View>
              <Text caption1 semibold grayColor>
                {t('status')}
              </Text>
              <Text title3 primaryColor semibold>
                {event.eventConfirmation.confirmedByCreatorAt
                  ? t('confirmed')
                  : t('not_confirmed')}
              </Text>
              {event.eventConfirmation.confirmedByCreatorAt ? (
                <Text caption1 semibold grayColor style={{marginTop: 5}}>
                  {t('submit_time') +
                    ': ' +
                    Utils.formatDate(
                      event.eventConfirmation.confirmedByCreatorAt * 1000,
                    ) +
                    ' at ' +
                    Utils.formatTime(
                      event.eventConfirmation.confirmedByCreatorAt * 1000,
                    )}
                </Text>
              ) : null}
            </View>
            {!event.eventConfirmation.confirmedByCreatorAt ||
            event.eventConfirmation.confirmedByCensorAt ? null : (
              <Button
                onPress={() => {
                  dispatch(
                    ApplicationActions.onShowPopupSelection(
                      t('confirm_event_report_popup_selection'),
                      t('cancel'),
                      t('confirm'),
                      () => {},
                      () => {
                        onSubmit(3);
                      },
                    ),
                  );
                }}>
                {t('confirm')}
              </Button>
            )}
          </View>
        );
      }
    }
    return null;
  };

  const renderNote = () => {
    if (role == 'LEADER') {
      return (
        <>
          <View style={{marginVertical: 10}}>
            <Text body2>{t('leader_note')}</Text>
          </View>
          {/* {event.eventConfirmation.confirmedByLeaderAt ? ( */}
          {false ? (
            <View style={{flex: 1}}>
              <Text body2 grayColor>
                {event.eventConfirmation.confirmedByLeaderNote}
              </Text>
            </View>
          ) : (
            <TextInput
              style={{marginTop: 10, height: 120}}
              onChangeText={text => setNote(text)}
              textAlignVertical="top"
              multiline={true}
              placeholder={t('input_leader_note')}
              value={note}
            />
          )}

          <View style={{marginVertical: 10}}>
            <Text body2>{t('creator_note')}</Text>
          </View>

          <View style={{flex: 1}}>
            <Text body2 grayColor>
              {/* {event.eventConfirmation.confirmedByCreatorAt
                ? event.eventConfirmation.confirmedByCreatorNote
                : t('creator_hasnt_confirm_yet')} */}
              {t('creator_hasnt_confirm_yet')}
            </Text>
          </View>
        </>
      );
    } else if (role == 'CREATOR') {
      return (
        <>
          <View style={{marginVertical: 10}}>
            <Text body2>{t('leader_note')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text body2 grayColor>
              {/* {event.eventConfirmation.confirmedByLeaderAt
                ? event.eventConfirmation.confirmedByLeaderNote
                : t('creator_hasnt_confirm_yet')} */}
              {t('creator_hasnt_confirm_yet')}
            </Text>
          </View>

          <View style={{marginVertical: 10}}>
            <Text body2>{t('creator_note')}</Text>
          </View>
          {/* {event.eventConfirmation.confirmedByCreatorAt ? ( */}
          {false ? (
            <View style={{flex: 1}}>
              <Text body2 grayColor>
                {event.eventConfirmation.confirmedByCreatorNote}
              </Text>
            </View>
          ) : (
            <TextInput
              style={{marginTop: 10, height: 120}}
              onChangeText={text => setNote(text)}
              textAlignVertical="top"
              multiline={true}
              placeholder={t('input_creator_note')}
              value={note}
            />
          )}
        </>
      );
    } else {
      return (
        <>
          <View style={{marginVertical: 10}}>
            <Text body2>{t('leader_note')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text body2 grayColor>
              {/* {event.eventConfirmation.confirmedByLeaderAt
                ? event.eventConfirmation.confirmedByLeaderNote
                : t('creator_hasnt_confirm_yet')} */}
              {t('creator_hasnt_confirm_yet')}
            </Text>
          </View>

          <View style={{marginVertical: 10}}>
            <Text body2>{t('creator_note')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text body2 grayColor>
              {/* {event.eventConfirmation.confirmedByCreatorAt
                ? event.eventConfirmation.confirmedByCreatorNote
                : t('creator_hasnt_confirm_yet')} */}
              {t('creator_hasnt_confirm_yet')}
            </Text>
          </View>
        </>
      );
    }
  };
  if (event == null) {
    return null;
  }

  const renderChecking = e => {
    return (
      <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
        <Text body1 semibold style={{marginBottom: 10}}>
          Attendance: {' ' + e.title}
        </Text>

        <View style={styles.field}>
          <View style={{flex: 1}}>
            <Text body2>{t('start')}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            {e.startAt ? (
              <>
                <Icon
                  name="check-square"
                  color={BaseColor.grayColor}
                  size={12}
                  style={{marginRight: 3}}
                />
                <Text caption1 grayColor>
                  {Utils.formatDateTime(e.startAt)}
                </Text>
              </>
            ) : (
              <Icon
                name="square"
                color={BaseColor.grayColor}
                size={12}
                style={{marginRight: 3}}
              />
            )}
          </View>
        </View>

        <View style={styles.field}>
          <View style={{flex: 1}}>
            <Text body2>{t('end')}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            {e.endAt ? (
              <>
                <Icon
                  name="check-square"
                  color={BaseColor.grayColor}
                  size={12}
                  style={{marginRight: 3}}
                />
                <Text caption1 grayColor>
                  {Utils.formatDateTime(e.endAt)}
                </Text>
              </>
            ) : (
              <Icon
                name="square"
                color={BaseColor.grayColor}
                size={12}
                style={{marginRight: 3}}
              />
            )}
          </View>
        </View>

        <View style={styles.field}>
          <View style={{flex: 1}}>
            <Text body2>{t('register_checked')}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text caption1 grayColor>
              {e.checkedParticipants.length}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('event_detail_confirm')}
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
        //   return (
        //     <Icon
        //       name="users"
        //       size={20}
        //       color={colors.primary}
        //       enableRTL={true}
        //     />
        //   );
        // }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        // onPressRight={() => {
        //   navigation.navigate('EventParticipantConfirm', {
        //     eventId: eventId,
        //     role: role,
        //     event,
        //   });
        // }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        <View style={{paddingHorizontal: 20}}>
          <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <Text body2 style={{marginBottom: 10}}>
              {t('title')}
            </Text>
            <Text body1 semibold>
              {event.information.title}
            </Text>
          </View>

          {role == 'CREATOR' ? (
            <>
              <View
                style={[styles.blockView, {borderBottomColor: colors.border}]}>
                <View style={styles.field}>
                  <View style={{flex: 1}}>
                    <Text body2>{t('event_created_at')}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    {event.createdAt ? (
                      <>
                        <Icon
                          name="check-square"
                          color={BaseColor.grayColor}
                          size={12}
                          style={{marginRight: 3}}
                        />
                        <Text caption1 grayColor>
                          {Utils.formatDateTime(event.createdAt)}
                        </Text>
                      </>
                    ) : (
                      <Icon
                        name="square"
                        color={BaseColor.grayColor}
                        size={12}
                        style={{marginRight: 3}}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.field}>
                  <View style={{flex: 1}}>
                    <Text body2>{t('event_submited_at')}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    {event.eventVerification.submittedAt ? (
                      <>
                        <Icon
                          name="check-square"
                          color={BaseColor.grayColor}
                          size={12}
                          style={{marginRight: 3}}
                        />
                        <Text caption1 grayColor>
                          {Utils.formatDateTime(
                            event.eventVerification.submittedAt * 1000,
                          )}
                        </Text>
                      </>
                    ) : (
                      <Icon
                        name="square"
                        color={BaseColor.grayColor}
                        size={12}
                        style={{marginRight: 3}}
                      />
                    )}
                  </View>
                </View>

                <View style={styles.field}>
                  <View style={{flex: 1}}>
                    <Text body2>{t('event_verified_at')}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    {event.eventVerification.verifiedAt ? (
                      <>
                        <Icon
                          name="check-square"
                          color={BaseColor.grayColor}
                          size={12}
                          style={{marginRight: 3}}
                        />
                        <Text caption1 grayColor>
                          {Utils.formatDateTime(
                            event.eventVerification.verifiedAt * 1000,
                          )}
                        </Text>
                      </>
                    ) : (
                      <Icon
                        name="square"
                        color={BaseColor.grayColor}
                        size={12}
                        style={{marginRight: 3}}
                      />
                    )}
                  </View>
                </View>
              </View>
            </>
          ) : null}

          <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <View style={styles.field}>
              <View style={{flex: 1}}>
                <Text body2>{t('event_start_at')}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                {event.information.eventStart ? (
                  <>
                    <Icon
                      name="check-square"
                      color={BaseColor.grayColor}
                      size={12}
                      style={{marginRight: 3}}
                    />
                    <Text caption1 grayColor>
                      {Utils.formatDateTime(event.information.eventStart)}
                    </Text>
                  </>
                ) : (
                  <Icon
                    name="square"
                    color={BaseColor.grayColor}
                    size={12}
                    style={{marginRight: 3}}
                  />
                )}
              </View>
            </View>

            <View style={styles.field}>
              <View style={{flex: 1}}>
                <Text body2>{t('event_end_at')}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                {event.information.eventEnd ? (
                  <>
                    <Icon
                      name="check-square"
                      color={BaseColor.grayColor}
                      size={12}
                      style={{marginRight: 3}}
                    />
                    <Text caption1 grayColor>
                      {Utils.formatDateTime(event.information.eventEnd)}
                    </Text>
                  </>
                ) : (
                  <Icon
                    name="square"
                    color={BaseColor.grayColor}
                    size={12}
                    style={{marginRight: 3}}
                  />
                )}
              </View>
            </View>

            <View style={styles.field}>
              <View style={{flex: 1}}>
                <Text body2>{t('total_participant')}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <Text caption1 grayColor>
                  {event.participantRole.length}
                </Text>
              </View>
            </View>
          </View>

          {/* {event.attendancePeriods.map(e => renderChecking(e))} */}

          <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <Text body1 semibold style={{marginBottom: 10}}>
              {t('report')}
            </Text>

            {/* {event.eventConfirmation.confirmedByLeaderAt ? ( */}
            {true ? (
              <>
                <View style={styles.field}>
                  <View style={{flex: 1}}>
                    <Text body2>{t('leader_confirmed')}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Icon
                      name="check-square"
                      color={BaseColor.grayColor}
                      size={12}
                      style={{marginRight: 3}}
                    />
                    {/* <Text caption1 grayColor>
                      {Utils.formatDateTime(
                        event.eventConfirmation.confirmedByLeaderAt * 1000,
                      )}
                    </Text> */}
                  </View>
                </View>

                {/* <View style={styles.field}>
                  <View style={{flex: 1}}>
                    <Text body2>{t('leader_name')}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text caption1 grayColor>
                      {event.eventConfirmation.confirmedByLeaderAt}
                    </Text>
                  </View>
                </View>

                <View style={styles.field}>
                  <View style={{flex: 1}}>
                    <Text body2>{t('leader_email')}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Text caption1 grayColor>
                      {event.eventConfirmation.confirmedByLeaderAt}
                    </Text>
                  </View>
                </View> */}
              </>
            ) : (
              <View style={styles.field}>
                <View style={{flex: 1}}>
                  <Text body2>{t('leader_confirmed')}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Icon
                    name="square"
                    color={BaseColor.grayColor}
                    size={12}
                    style={{marginRight: 3}}
                  />
                </View>
              </View>
            )}

            {/* {event.eventConfirmation.confirmedByCreatorAt ? ( */}
            {true ? (
              <>
                <View style={styles.field}>
                  <View style={{flex: 1}}>
                    <Text body2>{t('creator_confirmed')}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Icon
                      name="check-square"
                      color={BaseColor.grayColor}
                      size={12}
                      style={{marginRight: 3}}
                    />
                    {/* <Text caption1 grayColor>
                      {Utils.formatDateTime(
                        event.eventConfirmation.confirmedByCreatorAt,
                      )}
                    </Text> */}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.field}>
                <View style={{flex: 1}}>
                  <Text body2>{t('creator_confirmed')}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Icon
                    name="square"
                    color={BaseColor.grayColor}
                    size={12}
                    style={{marginRight: 3}}
                  />
                </View>
              </View>
            )}

            {/* {event.eventConfirmation.confirmedByCensorAt ? ( */}
            {true ? (
              <>
                <View style={styles.field}>
                  <View style={{flex: 1}}>
                    <Text body2>{t('censor_confirmed')}</Text>
                  </View>
                  <View style={{flex: 1, alignItems: 'flex-end'}}>
                    <Icon
                      name="check-square"
                      color={BaseColor.grayColor}
                      size={12}
                      style={{marginRight: 3}}
                    />
                    {/* <Text caption1 grayColor>
                      {Utils.formatDateTime(
                        event.eventConfirmation.confirmedByCensorAt * 1000,
                      )}
                    </Text> */}
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.field}>
                <View style={{flex: 1}}>
                  <Text body2>{t('censor_confirmed')}</Text>
                </View>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Icon
                    name="square"
                    color={BaseColor.grayColor}
                    size={12}
                    style={{marginRight: 3}}
                  />
                </View>
              </View>
            )}
          </View>

          <View style={[styles.blockView, {borderBottomColor: colors.border}]}>
            <Text body1 semibold style={{marginBottom: 10}}>
              {t('note')}
            </Text>
            {renderNote()}
          </View>
        </View>
      </ScrollView>

      {renderBottom()}
    </SafeAreaView>
  );
}
