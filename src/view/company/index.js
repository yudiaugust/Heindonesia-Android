import React, { Component } from "react";
import Company from "./company.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Company: { screen: Company }
}));
