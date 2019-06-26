import React, { Component } from "react";
import ChangePassword from "./password.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  ChangePassword: { screen: ChangePassword }
}));
