import React, { Component } from "react";
import Claim from "./claim.js";
import AddClaim from "./addclaim.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Claim: { screen: Claim },
  AddClaim: { screen: AddClaim }
}));
