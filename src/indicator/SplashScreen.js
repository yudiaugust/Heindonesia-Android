import React from 'react';
import { StyleSheet, View , Image, Alert, AsyncStorage, BackHandler } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Label, Card, CardItem, Thumbnail, List, ListItem, Footer, FooterTab } from "native-base";
import { StackActions, NavigationActions } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

export default class SplashScreen extends React.Component {
	
	constructor(props) {
 super(props);
 this.state = {
	   isFromMockProvider: 'false',
    };
}
	
	componentDidMount() {
	
   AsyncStorage.getItem('username').then((data) => {
		let username = data;

		if (username !== null) {
   fetch('http://103.247.10.156/~heiteknologi/api/Check_Employee.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              username: data,
             })
       
      }).then((response) => response.json())
            .then((responseJson) => { 
              this.props.navigation.navigate("Home")
            }).catch((error) => {
			  this.props.navigation.navigate("Login")
            }).done();
		} else {
			this.props.navigation.navigate("Login")
		}
	});		
	
	}
  
	render() {
        return (
            <View style={styles.container}>
				<Image style={styles.bgimage} source={require('../assets/images/splash.png')}/>
			</View>
        )
    }
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0fa1d4',
    },
    bgimage:{
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: '100%',
      height: '100%',
    }
});