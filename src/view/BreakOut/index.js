import React, { Component } from "react";
import BreakOut from "./BreakOut.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  BreakOut: { screen: BreakOut },
}));
