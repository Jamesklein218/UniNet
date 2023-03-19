import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {store, persistor} from 'app/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Navigator from './navigation';
import {PopUpSelection} from '@components';

console.disableYellowBox = true;

export default function App() {
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
