import React, { Component } from "react";
import UserList from "./Userlist.js";
import Chat from "./chat.js";
import { StackNavigator } from "react-navigation";
export default (DrawNav = StackNavigator({
	UserList: { screen: UserList },
	Chat: { screen: Chat },
}));
