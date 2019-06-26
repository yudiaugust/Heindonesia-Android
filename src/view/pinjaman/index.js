import React, { Component } from "react";
import Pinjaman from "./pinjaman.js";
import AddPinjaman from "./addpinjaman.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Pinjaman: { screen: Pinjaman },
  AddPinjaman: { screen: AddPinjaman }
}));
