/* eslint-disable react/forbid-prop-types */
import { DrawerNavigator } from 'react-navigation';
import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';


import BackupScreen from '../components/BackupSettingScreen';
import GalleryScreen from '../components/GalleryScreen';
import HomeScreen from '../components/HomeScreen';


const DrawerLabel = ({ children, ...props }) => (
  <Text
    style={{
      margin: 16,
      fontSize: 15,
      paddingTop: 15,
      paddingBottom: 15,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: '#111',
    }}
    {...props}
  >
    {children}
  </Text>);

DrawerLabel.propTypes = {
  children: PropTypes.any.isRequired,
};

const DrawerNavigation = DrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: (<DrawerLabel>Home</DrawerLabel>),
      headerTitle: 'Home',
    },
  },
  Gallery: {
    screen: GalleryScreen,
    navigationOptions: {
      drawerLabel: (<DrawerLabel>Gallery</DrawerLabel>),
      headerTitle: 'Gallery',
    },
  },
  BackupSetting: {
    screen: BackupScreen,
    navigationOptions: {
      drawerLabel: (<DrawerLabel>Settings</DrawerLabel>),
      headerTitle: 'Settings',
    },
  },
}, {
  initialRouteName: 'Home',
  navigationOptions: {
    headerTitle: 'Menu',
  },
});


export default DrawerNavigation;
