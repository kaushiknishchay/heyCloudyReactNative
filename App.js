/* eslint-disable react/prop-types */
import React from 'react';
import { StatusBar } from 'react-native';


import MainNavigation from './src/navigation/MainNavigation';
import { statusBarColor } from './src/constants/colors';

const App = props => (
  <React.Fragment>
    <StatusBar
      backgroundColor={statusBarColor}
      barStyle="light-content"
    />
    <MainNavigation />
  </React.Fragment>
);
export default App;
