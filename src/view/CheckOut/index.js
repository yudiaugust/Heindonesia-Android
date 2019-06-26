import React, { Component } from "react";
import CheckOut from "./CheckOut.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  CheckOut: { screen: CheckOut },
}));
