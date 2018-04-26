import React from 'react';
import { StackNavigator } from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import DrawerNavigation from './DrawerNavigation';
import * as colors from '../constants/colors';
import Str from '../constants/string';

const MainNavigation = StackNavigator({
  Root: DrawerNavigation,
}, {
  navigationOptions: ({ navigation }) => ({
    title: Str.appName,
    headerTitleStyle: {
      fontFamily: 'Roboto',
      color: colors.headerTitleColor,
    },
    headerStyle: {
      backgroundColor: colors.headerColor,
    },
    headerLeft: (
      <MaterialIcons
        onPress={() => navigation.navigate('DrawerToggle')}
        name="menu"
        size={30}
        style={{
          marginLeft: 15,
        }}
        color={colors.headerTitleColor}
      />
    ),
  }),
});

export default MainNavigation;
