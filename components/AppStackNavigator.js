import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import NotificationsScreen from '../screens/NotificationsScreen';




export const AppStackNavigator = createStackNavigator({
  NotificationsList : {
    screen : NotificationsScreen,
    navigationOptions:{
      headerShown : false
    }
  },

},
  {
    initialRouteName: 'NotificationsList'
  }
);