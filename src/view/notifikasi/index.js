import React, { Component } from "react";
import Notifikasi from "./notifikasi.js";
import Detail from "./detail.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
  Notifikasi: { screen: Notifikasi },
  Detail: { screen: Detail }
}));
