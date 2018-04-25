/* eslint-disable react/prop-types */
import React from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';


import configureStore from './src/store/store';
import MainNavigation from './src/navigation/MainNavigation';
import { statusBarColor } from './src/constants/colors';

const store = configureStore();

const App = props => (
  <Provider store={store}>
    <React.Fragment>
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle="light-content"
      />
      <MainNavigation />
    </React.Fragment>
  </Provider>
);
export default App;
