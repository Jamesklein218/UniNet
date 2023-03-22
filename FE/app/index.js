import React, {useLayoutEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {store, persistor} from 'app/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Navigator from './navigation';
import {PopUpSelection} from '@components';
import Geocoder from 'react-native-geocoding';

console.disableYellowBox = true;

export default function App() {
  useLayoutEffect(() => {
    console.log('INIT GOOGLE MAP', process.env.REACT_APP_GOOGLE_MAP_API);
    Geocoder.init(process.env.REACT_APP_GOOGLE_MAP_API);
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigator />
          <PopUpSelection />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
