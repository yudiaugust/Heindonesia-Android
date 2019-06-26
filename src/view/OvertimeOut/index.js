import React, { Component } from "react";
import OvertimeOut from "./OvertimeOut.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  OvertimeOut: { screen: OvertimeOut },
}));
