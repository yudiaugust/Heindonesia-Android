import React, { Component } from "react";
import Filter from "./filter.js";
import Slip from "./slip.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Filter: { screen: Filter },
  Slip: { screen: Slip }
}));
