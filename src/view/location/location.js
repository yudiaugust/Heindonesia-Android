import React from "react";
import { ActivityIndicator, StyleSheet, AppRegistry, Alert, View, Platform, Dimensions, BackHandler, DeviceEventEmitter } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import MapView, { Marker, AnimatedRegion, Animated } from 'react-native-maps';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

const LATITUDE = -6.1757936;
const LONGITUDE = 106.7992172;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;


export default class Location extends React.Component {
	_isMounted = false;
	constructor(props) {
  super(props);
  
  this.state = {
	   isLoading: true,
    latitude: LATITUDE,
    longitude: LONGITUDE,
    routeCoordinates: [],
    prevLatLng: {},
    coordinate: new AnimatedRegion({
     latitude: LATITUDE,
     longitude: LONGITUDE,
	 initialPosition: 'unknown',
    })
  };
}

  componentWillMount() {
	this._isMounted = true;
	  LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
            ok: "YES",
            cancel: "NO",
            enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
            showDialog: true, // false => Opens the Location access page directly
            openLocationServices: true, // false => Directly catch method is called if location services are turned off
            preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
            preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
            providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
        }).then(function(success) {
            // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
                this.watchID = navigator.geolocation.getCurrentPosition(
    position => {
      const { coordinate, routeCoordinates } =   this.state;
      const { latitude, longitude } = position.coords;
      
      const newCoordinate = {
        latitude,
        longitude
      };
      if (Platform.OS === "android") {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(
            newCoordinate,
            500
          );
         }
       } else {
         coordinate.timing(newCoordinate).start();
       }
       this.setState({
		   isLoading: false,
         latitude,
         longitude,
         routeCoordinates: routeCoordinates.concat([newCoordinate]),
         prevLatLng: newCoordinate
       });
     },
     error => console.log(error),
     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );
            }.bind(this)
        ).catch((error) => {
            console.log(error.message);
        });
        
        DeviceEventEmitter.addListener('locationProviderStatusChange', function(status) { // only trigger when "providerListener" is enabled
            console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
        });
}
    


	getMapRegion = () => ({
		latitude: this.state.latitude,
		longitude: this.state.longitude,
		latitudeDelta: LATITUDE_DELTA,
		longitudeDelta: LONGITUDE_DELTA
	});
	
	componentWillUnmount() {
        // used only when "providerListener" is enabled
        LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
		navigator.geolocation.clearWatch(this.watchID);
    this._isMounted = false;
    } 
  
  render() {
	  if (this.state.isLoading) {
        return (
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        );
      }
    return (
      <Container>
        <Content>
          <View style ={styles.container}>
			<MapView
				style={styles.map}
				showUserLocation
				followUserLocation
				loadingEnabled
				region={this.getMapRegion()}
			>
  
				<Marker.Animated
					ref={marker => {
					this.marker = marker;
					}}
					coordinate={this.state.coordinate}
					title={"Your Location"}
				/>
			</MapView>
		  </View>
        </Content>
        <Footer style={styles.footer}>
          <FooterTab>
            <Button onPress={this.toggleTracking} style={styles.button}>
              <Icon name={isRunning ? 'pause' : 'play'}/>
			  <Text>{isRunning ? 'Finish Drive' : 'Start Drive'}</Text>
            </Button>
          </FooterTab>
        </Footer>
        <Footer>
          <FooterTab style={styles.footer}>
            <Button style={styles.footer} onPress={() => this.props.navigation.navigate("Home")}>
              <Icon name="ios-home" style={styles.iconFooter}/>
			  <Text style={styles.footerText}>Beranda</Text>
            </Button>
            <Button style={styles.footer} onPress={() => this.props.navigation.navigate("Simulasi")}>
              <Icon name="paper" style={styles.iconFooter}/>
			  <Text style={styles.footerText}>Simulasi</Text>
            </Button>
            <Button style={styles.footer} onPress={() => this.props.navigation.navigate("Profile")}>
              <Icon name="person" style={styles.iconFooter}/>
			  <Text style={styles.footerText}>Profil</Text>
            </Button>
            <Button style={styles.footer} onPress={() => this.props.navigation.navigate('Chat', { company: this.state.companyCode })}>
              <Icon name="ios-chatboxes" style={styles.iconFooter}/>
			  <Text style={styles.footerText}>Support</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("Bantuan")} style={styles.footer}>
              <Icon name="headset" style={styles.iconFooter}/>
			  <Text style={styles.footerText}>Call Us</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
	  
    );
  }
}
Location.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>My Location</Title>
      </Body>
      <Right>
        <Button transparent onPress={() => navigation.navigate("Notifikasi")}>
          <Icon name='ios-notifications' style={styles.notif} />
        </Button>
      </Right>
    </Header>
  )
});

const styles = StyleSheet.create({
  
  header:{
	backgroundColor: '#0fa1d4',
  },
  button : {
    backgroundColor: '#0fa1d4',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
	map: {
	position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  footer: {
    backgroundColor: '#0fa1d4',
  },
  footerText: {
    fontSize: textFontSize,
    color: '#fff',
    fontWeight: '100',
  },
  iconFooter: {
    color: '#fff',
    fontSize: 28
  }
});