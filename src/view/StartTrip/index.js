import React, { Component } from "react";
import StartTrip from "./StartTrip.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  StartTrip: { screen: StartTrip },
}));
