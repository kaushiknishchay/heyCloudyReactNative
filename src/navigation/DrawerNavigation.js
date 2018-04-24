/* eslint-disable react/forbid-prop-types */
import { DrawerNavigator } from 'react-navigation';
import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import BackupScreen from '../components/BackupSettingScreen';
import GalleryScreen from '../components/GalleryScreen';
import HomeScreen from '../components/HomeScreen';
import { accentColor } from '../constants/colors';


const DrawerLabel = ({ children, icon, ...props }) => (
  <View
    style={{
    margin: 16,
    flexDirection: 'row',
    padding: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
  }}
  >
    {icon ? <MaterialIcons
      name={icon}
      size={25}
      color={accentColor}
      style={{
        marginRight: 10,
      }}
    /> : null}
    <Text
      style={{
      flex: 3,
      marginLeft: 20 + icon ? 0 : 34,
      fontSize: 17,
      padding: 5,
      lineHeight: 20,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: '#111',
    }}
      {...props}
    >
      {children}
    </Text>
  </View>);

DrawerLabel.propTypes = {
  children: PropTypes.any.isRequired,
  // eslint-disable-next-line react/require-default-props
  icon: PropTypes.any,
};

const DrawerNavigation = DrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: (
        <DrawerLabel icon="home">
        Home
        </DrawerLabel>),
      headerTitle: 'Home',
    },
  },
  Gallery: {
    screen: GalleryScreen,
    navigationOptions: {
      drawerLabel: (
        <DrawerLabel>
        Gallery
        </DrawerLabel>),
      headerTitle: 'Gallery',
    },
  },
  BackupSetting: {
    screen: BackupScreen,
    navigationOptions: {
      drawerLabel: (
        <DrawerLabel icon="settings">
          Settings
        </DrawerLabel>),
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
