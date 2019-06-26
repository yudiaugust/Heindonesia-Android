import React, { Component } from "react";
import CheckIn from "./CheckIn.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  CheckIn: { screen: CheckIn },
}));
