import React, { Component } from "react";
import Bantuan from "./bantuan.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Bantuan: { screen: Bantuan },
}));
