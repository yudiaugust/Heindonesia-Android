import React, { Component } from "react";
import OvertimeIn from "./OvertimeIn.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  OvertimeIn: { screen: OvertimeIn },
}));
