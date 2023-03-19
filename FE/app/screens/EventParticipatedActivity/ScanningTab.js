/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Animated,
  Easing,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Text, Icon, Image, ProfilePerformance, Button} from '@components';
import {SvgXml} from 'react-native-svg';
import {connect} from 'react-redux';
import {channingActions} from '@utils';
import {EventActions} from '@actions';
import {Images} from '@config';
import {UserData} from '@data';
import styles from './styles';
import {BaseColor} from '@config';

const SVG = `<svg width="215" height="215" viewBox="0 0 215 215" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 15.75V1.25H16" stroke="#FB844A" stroke-width="5"/>
<path d="M199.75 0.999999L214.25 1L214.25 16" stroke="#FB844A" stroke-width="5"/>
<path d="M214.5 199.25L214.5 213.75L199.5 213.75" stroke="#FB844A" stroke-width="5"/>
<path d="M16.25 214L1.75 214L1.75 199" stroke="#FB844A" stroke-width="5"/>
</svg>
`;

const userData = UserData[0];

export default class ScanningTab extends Component {
  constructor(props) {
    super(props);
    this.camera = null;

    this.state = {
      barcodeCode: '',
      success: false,
      message: '',
      userData: null,
      finishCheck: false,
      scanStatus: true,
      camera: {
        type: RNCamera.Constants.Type.back,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
    };
    this.animatedValue = new Animated.Value(0);
  }

  onBarCodeRead(scanResult) {
    if (scanResult.data != null && this.state.barcodeCode == '') {
      this.setState({success: true});
      // this.setState({barcodeCode: scanResult.data});
      console.log('SCANN', scanResult);
      EventActions.verifyCode(this.props.event._id, scanResult.data)
        .then(res => {
          console.log('Verify code successful', res);
          this.setState({barcodeCode: scanResult.data, userData: res.data});
        })
        .catch(err => {
          console.log('Error in verify code', JSON.stringify(err));
          this.setState({
            barcodeCode: '',
            message: err.error.response.data.message,
            success: false,
          });
        });
    }
    return;
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => this.animate());
  }

  setVisible = () => {
    this.setState({barcodeCode: ''});
  };

  complete = () => {
    if (this.state.barcodeCode != '') {
      EventActions.checkAttendance(this.props.event._id, this.state.barcodeCode)
        .then(res => {
          console.log('Check attendance sucess');
          this.setState({
            barcodeCode: '',
            finishCheck: true,
            scanStatus: true,
            message: 'Sucess',
          });
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          this.setState({barcodeCode: '', scanStatus: false});
        });
    }
  };

  taskPopup = () => {
    return (
      <Modal
        transparent={true}
        visible={this.state.success}
        setVisible={this.setVisible}
        fullScreen={true}>
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.8)',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
            }}>
            <View style={styles.contentInfor}>
              {/* {!this.state.finishCheck && this.state.scanStatus != false ? (
                <Image
                  style={{width: 100, height: 100, borderRadius: 40}}
                  source={Images.profile2}
                />
              ) : (
                <Text headline primaryColor>
                  {this.state.scanStatus
                    ? 'Success'
                    : 'User checked or Not register event'}
                </Text>
              )} */}
              {this.renderUser()}
            </View>

            {/* {this.state.finishCheck || this.state.scanStatus == false ? (
              <Button
                onPress={() => {
                  this.setState({
                    success: false,
                    barcodeCode: '',
                    scanStatus: true,
                    finishCheck: false,
                  });
                }}
                style={{marginTop: 28, marginBottom: 28}}>
                OK
              </Button>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <Button
                  onPress={() => {
                    this.complete();
                  }}
                  style={{marginTop: 28, marginBottom: 28}}>
                  Checking
                </Button>
                <Button
                  onPress={() => {
                    this.setState({
                      barcodeCode: '',
                      finishCheck: false,
                      scanStatus: true,
                      success: false,
                    });
                  }}
                  style={{
                    marginTop: 28,
                    marginLeft: 28,
                    backgroundColor: '#cccccc',
                  }}>
                  cancel
                </Button>
              </View>
            )} */}
          </View>
        </View>
      </Modal>
    );
  };

  renderUser = () => {
    if (this.state.barcodeCode == '') {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {!this.state.message ? (
            <ActivityIndicator
              size="large"
              color={BaseColor.primary}
              style={{
                marginTop: 20,
              }}
            />
          ) : (
            <Text body1 grayColor style={{marginTop: 20}}>
              {this.state.message}
            </Text>
          )}
          <View
            style={{marginHorizontal: 20, marginTop: 50, flexDirection: 'row'}}>
            <Button
              onPress={() => {
                this.setState({success: false, message: ''});
              }}
              full>
              Back
            </Button>
          </View>
        </View>
      );
    }
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{width: 100, height: 100, borderRadius: 40}}
          source={Images.profile2}
        />
        <Text title1 semibold>
          {this.state?.userData?.name}
        </Text>
        <ProfilePerformance
          data={[{value: this.state.userData?.roleName, title: 'Role'}]}
          style={{width: '100%', paddingHorizontal: 75}}
          flexDirection="column"
        />
        <View style={{flexDirection: 'row'}}>
          <Button
            onPress={() => {
              this.complete();
            }}
            style={{marginTop: 28, marginBottom: 28}}>
            Checking
          </Button>
          <Button
            onPress={() => {
              this.setState({
                success: false,
                barcodeCode: '',
              });
            }}
            style={{
              marginTop: 28,
              marginLeft: 28,
              backgroundColor: '#cccccc',
            }}>
            cancel
          </Button>
        </View>
      </View>
    );
  };

  render() {
    const movingTop = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-10, 230, 0],
    });
    return (
      <View style={styles.container}>
        {this.taskPopup()}

        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          defaultTouchToFocus
          flashMode={this.state.camera.flashMode}
          mirrorImage={false}
          onBarCodeRead={this.onBarCodeRead.bind(this)}
          onFocusChanged={() => {}}
          onZoomChanged={() => {}}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          style={styles.preview}
          type={this.state.camera.type}
        />
        <View
          style={{
            flex: 30,
            backgroundColor: 'rgba(38,38,38,0.6)',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
          <Text title1 style={{color: 'white', fontSize: 20}}>
            SCAN QRCODE OR STUDENT CARD
          </Text>
          <Text title1 style={{color: 'white', fontSize: 20}}>
            TO CHECK ATTENDANCE
          </Text>
        </View>
        <View
          style={{
            flex: 42,
            backgroundColor: 'rgba(255,255,38,0)',
            flexDirection: 'row',
          }}>
          <View style={{flex: 1, backgroundColor: 'rgba(38,38,38,0.6)'}} />
          <View style={{flex: 4, backgroundColor: 'rgba(38,38,38,0)'}}>
            <SvgXml xml={SVG} width="100%" height="100%" />
            <Animated.View
              style={{
                position: 'absolute',
                top: movingTop,
                marginTop: 10,
                height: 3,
                width: '100%',
                backgroundColor: 'orange',
              }}
            />
          </View>
          <View style={{flex: 1, backgroundColor: 'rgba(38,38,38,0.6)'}} />
        </View>
        <View
          style={{
            flex: 35,
            backgroundColor: 'rgba(38,38,38,0.6)',
            alignItems: 'center',
            paddingTop: 20,
          }}>
          <Text title1 style={{color: 'white', fontSize: 20}}>
            Touch to turn on flash
          </Text>
        </View>
      </View>
    );
  }
}
