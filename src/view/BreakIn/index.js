import React, { Component } from "react";
import BreakIn from "./BreakIn.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  BreakIn: { screen: BreakIn },
}));
