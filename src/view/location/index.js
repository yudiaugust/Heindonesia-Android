import React, { Component } from "react";
import Location from "./location.js";
import { StackNavigator } from "react-navigation";

export default (DrawNav = StackNavigator({
  Location: { screen: Location },
}));
