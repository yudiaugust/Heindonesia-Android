import React, { Component } from "react";
import HomeScreen from "./home.js";
import Profile from "../../view/profile/index.js";
import Slip from "../../view/SlipGaji/index.js";
import Company from "../../view/company/index";
import Simulasi from "../../view/simulasi/index";
import History from "../../view/history/index";
import Attendance from "../../view/attendance/index";
import Piket from "../../view/piket/index";
import Bantuan from "../../view/bantuan/index";
import Pinjaman from "../../view/pinjaman/index";
import Absence from "../../view/absence/index";
import Claim from "../../view/claim/index";
import Location from "../../view/location/index";
import ChangePassword from "../../view/password/index";
import CheckIn from "../../view/CheckIn/index";
import CheckOut from "../../view/CheckOut/index";
import BreakIn from "../../view/BreakIn/index";
import BreakOut from "../../view/BreakOut/index";
import OvertimeIn from "../../view/OvertimeIn/index";
import OvertimeOut from "../../view/OvertimeOut/index";
import StartTrip from "../../view/StartTrip/index";
import Chat from "../../view/Chat/index";
import SideBar from "../../sidebar/sidebar.js";
import { DrawerNavigator } from "react-navigation";
const HomeScreenRouter = DrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Profile: { screen: Profile },
    Slip: { screen: Slip },
    Company: { screen: Company },
    Simulasi: { screen: Simulasi },
    History: { screen: History },
    Attendance: { screen: Attendance },
    Piket: { screen: Piket },
    Bantuan: { screen: Bantuan },
    Pinjaman: { screen: Pinjaman },
    Absence: { screen: Absence },
    Claim: { screen: Claim },
    Location: { screen: Location },
    ChangePassword: { screen: ChangePassword },
    CheckIn: { screen: CheckIn },
    CheckOut: { screen: CheckOut },
    BreakIn: { screen: BreakIn },
    BreakOut: { screen: BreakOut },
    OvertimeIn: { screen: OvertimeIn },
    OvertimeOut: { screen: OvertimeOut },
    StartTrip: { screen: StartTrip },
    Chat: { screen: Chat }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);
export default HomeScreenRouter;
