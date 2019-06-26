import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/view/login/login';
import SignUp from './src/view/registrasi/Signup';
import HomeScreen from './src/view/home/home';
import Profile from "./src/view/profile/index";
import History from "./src/view/history/index";
import Filter from "./src/view/SlipGaji/index";
import Company from "./src/view/company/index";
import Simulasi from "./src/view/simulasi/index";
import Notifikasi from "./src/view/notifikasi/index";
import Attendance from "./src/view/attendance/index";
import Piket from "./src/view/piket/index";
import Bantuan from "./src/view/bantuan/index";
import Pinjaman from "./src/view/pinjaman/index";
import Absence from "./src/view/absence/index";
import Claim from "./src/view/claim/index";
import Location from "./src/view/location/index";
import ChangePassword from "./src/view/password/index";
import CheckIn from "./src/view/CheckIn/index";
import CheckOut from "./src/view/CheckOut/index";
import BreakIn from "./src/view/BreakIn/index";
import BreakOut from "./src/view/BreakOut/index";
import OvertimeIn from "./src/view/OvertimeIn/index";
import OvertimeOut from "./src/view/OvertimeOut/index";
import StartTrip from "./src/view/StartTrip/index";
import Chat from "./src/view/Chat/index";
import SplashScreen from './src/indicator/SplashScreen';
import firebase from 'react-native-firebase';
import type { Notification, NotificationOpen } from 'react-native-firebase';

import { StackActions, NavigationActions, StackNavigator, DrawerNavigator } from 'react-navigation';

const drHome = DrawerNavigator({
  Home: {
    screen: HomeScreen,
  },
  SignUp:{
      screen: SignUp,
  },
  Profile: {
    screen: Profile,
  },
  History: {
	  screen: History
  },
  Filter: {
    screen: Filter,
  },
  Company: {
    screen: Company,
  },
  Simulasi: {
    screen: Simulasi,
  },
  Notifikasi: {
    screen: Notifikasi,
  },
  Attendance: {
    screen: Attendance,
  },
  Piket: {
    screen: Piket,
  },
  Bantuan: {
    screen: Bantuan,
  },
  Pinjaman: {
    screen: Pinjaman,
  },
  Absence: {
    screen: Absence,
  },
  Claim: {
    screen: Claim,
  },
  Location: {
    screen: Location,
  },
  ChangePassword: {
    screen: ChangePassword,
  },
  CheckIn:{
      screen: CheckIn,
  },
  CheckOut:{
      screen: CheckOut,
  },
  BreakIn:{
      screen: BreakIn,
  },
  BreakOut:{
      screen: BreakOut,
  },
  OvertimeIn:{
      screen: OvertimeIn,
  },
  OvertimeOut:{
      screen: OvertimeOut,
  },
  StartTrip:{
      screen: StartTrip,
  },
  Chat:{
      screen: Chat,
  },
});

const App = StackNavigator({
  Splash:{
       screen: SplashScreen,
  },
  Home:{
       screen: HomeScreen,
  },
  Profile: {
    screen: Profile,
  },
  History: {
	  screen: History
  },
  Filter: {
    screen: Filter,
  },
  Company: {
    screen: Company,
  },
  Simulasi: {
    screen: Simulasi,
  },
  Notifikasi: {
    screen: Notifikasi,
  },
  Attendance: {
    screen: Attendance,
  },
  Piket: {
    screen: Piket,
  },
  Bantuan: {
    screen: Bantuan,
  },
  Pinjaman: {
    screen: Pinjaman,
  },
  Absence: {
    screen: Absence,
  },
  Claim: {
    screen: Claim,
  },
  Location: {
    screen: Location,
  },
  ChangePassword: {
    screen: ChangePassword,
  },
  Login:{
      screen: LoginScreen,
  },
  SignUp:{
      screen: SignUp,
  },
  CheckIn:{
      screen: CheckIn,
  },
  CheckOut:{
      screen: CheckOut,
  },
  BreakIn:{
      screen: BreakIn,
  },
  BreakOut:{
      screen: BreakOut,
  },
  OvertimeIn:{
      screen: OvertimeIn,
  },
  OvertimeOut:{
      screen: OvertimeOut,
  },
  StartTrip:{
      screen: StartTrip,
  },
  Chat:{
      screen: Chat,
  },
},
  {
  headerMode: 'none',
  navigationOptions:{ 
    header:{ 
      visible: false,
      left: null,
    },
    gesturesEnabled: false,
  },
});

export class Notif extends Component {
    async componentDidMount() {
        const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const action = notificationOpen.action;
            const notification: Notification = notificationOpen.notification;
            var seen = [];
            alert(JSON.stringify(notification.data, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            }));
        } 
        const channel = new firebase.notifications.Android.Channel('campaign', 'Campaign', firebase.notifications.Android.Importance.Max)
                .setDescription('Heindonesia Notification');
// Create the channel
        firebase.notifications().android.createChannel(channel);
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        });
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            notification
                .android.setChannelId('inbox')
                .android.setSmallIcon('ic_launcher');
            firebase.notifications()
                .displayNotification(notification);
            
        });
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            var seen = [];
            alert(JSON.stringify(notification.data, function(key, val) {
                if (val != null && typeof val == "object") {
                    if (seen.indexOf(val) >= 0) {
                        return;
                    }
                    seen.push(val);
                }
                return val;
            }));
            firebase.notifications().removeDeliveredNotification(notification.notificationId);
            
        });
    }
    componentWillUnmount() {
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
    }
}

export default App;