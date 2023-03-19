import React, {useState, useEffect} from 'react';
import {FlatList, RefreshControl, ScrollView} from 'react-native';
import {useTheme} from '@config';
import {ActivityBox} from '@components';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {bindReportActions} from '@actions';
import * as Utils from '@utils';
import {useDispatch} from 'react-redux';
import {ApplicationActions} from '@actions';

function ReportTab(props) {
  const {navigation} = props;
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(ApplicationActions.onShowLoading());
    // const {reportActions} = props;
    // reportActions
    //   .getReportActivity()
    //   .then((res) => {
    //     console.log('Report Activity Tab props: ', props.report);
    //     dispatch(ApplicationActions.onHideLoading());
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

  const onRefresh = () => {
    // dispatch(ApplicationActions.onShowLoading());
    // const {reportActions} = props;
    // reportActions
    //   .getReportActivity()
    //   .then((res) => {
    //     console.log('Report Activity Tab props: ', props.report);
    //     dispatch(ApplicationActions.onHideLoading());
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const renderItem = item => {
    console.log(item, 'TREDVE');
    return (
      <ActivityBox
        name={'Đánh giá đoàn viên hội viên 4/2021'}
        time={Utils.formatDate(item.createdAt)}
        amount={'Grade: ' + item.grade}
        style={{paddingVertical: 10, marginHorizontal: 20}}
        onPress={() =>
          navigation.navigate('ReportActivity', {
            answerId: item._id,
            questionId: item.session.question,
            sessionId: item.session._id,
          })
        }
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={{padding: 10}}>
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
          />
        }
        data={props.report.reportActivity}
        keyExtractor={(item, index) => item.id}
        renderItem={({item}) => renderItem(item)}
      />
    </ScrollView>
  );
}

export default connect(
  state => ({report: state.report}),
  dispatch => channingActions({}, dispatch, bindReportActions),
)(ReportTab);
