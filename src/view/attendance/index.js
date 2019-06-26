import React, { Component } from "react";
import Attendance from "./attendance.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Attendance: { screen: Attendance },
}));
