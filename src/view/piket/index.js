import React, { Component } from "react";
import Piket from "./piket.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Piket: { screen: Piket },
}));
