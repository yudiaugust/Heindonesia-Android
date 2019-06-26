import React, { Component } from "react";
import Simulasi from "./simulasi.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Simulasi: { screen: Simulasi }
}));
