import React, { Component } from "react";
import Absence from "./absence.js";
import AddAbsence from "./addabsence.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Absence: { screen: Absence },
  AddAbsence: { screen: AddAbsence }
}));
