import React, { Component } from "react";
import Profile from "./profile.js";
import Aplikasi from "./aplikasi.js";
import Terms from "./terms.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Profile: { screen: Profile },
  Aplikasi: { screen: Aplikasi },
  Terms: { screen: Terms }
}));
