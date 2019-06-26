import React from "react";
import { StyleSheet, StatusBar, TouchableOpacity, View, ActivityIndicator, Image, Dimensions, Alert, AsyncStorage, BackHandler } from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Thumbnail, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import MapView from 'react-native-maps';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import Geocoder from 'react-native-geocoder';
import TrackingDot from '../../assets/images/TrackingDot.png';

const LATITUDE = -6.1757936;
const LONGITUDE = 106.7992172;

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class StartTrip extends React.Component {
	_isMounted = false;
	constructor(props) {
    super(props);
    this.state = {
	   isLoading: true,
		username: '',
		branch: '',
		employeeID: '',
		employeeName: '',
		email: '',
		avatar: '',
		region: null,
		locations: [],
		stationaries: [],
		isRunning: false,
		startedOn: 'Unknown',
		finishOn: 'Unknown',
		startLat: '',
		startLong: '',
		startTime: '',
		finishLat: '',
		finishLong: '',
		finishTime: '',
		duration: '',
		distance: '',
		status: '',
		tanggal: '',
		companyCode: '',
		IsPremium: 'Y',
    };
  }

  componentDidMount() {
	this._isMounted = true;
	AsyncStorage.getItem('username').then((data) => {
		let username = data;

		if (username !== null)
			this.setState({
                username : data,
              })
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
 
              if (this._isMounted) {
          this.setState({
                branch : responseJson[0].branch,
				employeeID : responseJson[0].employeeID,
				employeeName : responseJson[0].name,
				email : responseJson[0].email,
				avatar : responseJson[0].mediaID,
				companyCode: responseJson[0].company,
				isLoading: false
              })
			  fetch('http://103.247.10.156/~heiteknologi/api/Check_Company.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              companyCode: this.state.companyCode,
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
          this.setState({
 
                IsPremium : responseJson[0].IsPremium,
 
              })
              
            })
			  }
              
            }).catch((error) => {
			  this.props.navigation.navigate("Login")
            }).done();
	});
	
	BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationTitle: 'Trip tracking',
      notificationText: 'Started',
      debug: false,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 60000,
      fastestInterval: 120000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      url: 'http://103.247.10.156/~heiteknologi/api/Update_Trip.php',//http://103.247.10.156/~heiteknologi/api/Update_Trip.php
      syncUrl: 'http://103.247.10.156/~heiteknologi/api/Update_Trip.php',
      httpHeaders: {
        'X-FOO': 'bar'
      }
    });
	
	console.log('map did mount');

    function logError(msg) {
      console.log(`[ERROR] getLocations: ${msg}`);
    }
	
    const handleHistoricLocations = locations => {
      let region = null;
      const now = Date.now();
      const latitudeDelta = 0.01;
      const longitudeDelta = 0.01;
      const durationOfDayInMillis = 24 * 3600 * 1000;

      const locationsPast24Hours = locations.filter(location => {
        return now - location.time <= durationOfDayInMillis;
      });

      if (locationsPast24Hours.length > 0) {
        // asume locations are already sorted
        const lastLocation =
          locationsPast24Hours[locationsPast24Hours.length - 1];
        region = Object.assign({}, lastLocation, {
          latitudeDelta,
          longitudeDelta
        });
      }
      this.setState({ locations: locationsPast24Hours, region });
    };
	
    BackgroundGeolocation.getValidLocations(
      handleHistoricLocations.bind(this),
      logError
    );

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('location', location => {
      console.log('[DEBUG] BackgroundGeolocation location', location);
      BackgroundGeolocation.startTask(taskKey => {
        requestAnimationFrame(() => {
          const longitudeDelta = 0.01;
          const latitudeDelta = 0.01;
          const region = Object.assign({}, location, {
            latitudeDelta,
            longitudeDelta
          });
          const locations = this.state.locations.slice(0);
          locations.push(location);
          this.setState({ locations, region });
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });

    BackgroundGeolocation.on('stationary', (location) => {
      console.log('[DEBUG] BackgroundGeolocation stationary', location);
      BackgroundGeolocation.startTask(taskKey => {
        requestAnimationFrame(() => {
          const stationaries = this.state.stationaries.slice(0);
          if (location.radius) {
            const longitudeDelta = 0.01;
            const latitudeDelta = 0.01;
            const region = Object.assign({}, location, {
              latitudeDelta,
              longitudeDelta
            });
            const stationaries = this.state.stationaries.slice(0);
            stationaries.push(location);
            this.setState({ stationaries, region });
          }
          BackgroundGeolocation.endTask(taskKey);
        });
      });
    });
	
    BackgroundGeolocation.on('start', () => {
      // service started successfully
      // you should adjust your app UI for example change switch element to indicate
      // that service is running	  
      console.log('[DEBUG] BackgroundGeolocation has been started');
      if (this._isMounted) { this.setState({ isRunning: true });}
	  BackgroundGeolocation.configure({
			postTemplate: {
				employeeID: this.state.employeeID,
				finishLat: '@latitude',
				finishLong: '@longitude',
				finishTime: new Date().getHours() +":"+ new Date().getMinutes() +":"+ new Date().getSeconds(),
				status: 'On Trip'
				}
			});
	  BackgroundGeolocation.getCurrentLocation((location) => {
		// Position Geocoding
			var NY = {
				lat: location.latitude,
				lng: location.longitude
			};

			Geocoder.geocodePosition(NY).then(res => {
				// res is an Array of geocoding object (see below)
				fetch('http://103.247.10.156/~heiteknologi/api/Insert_Trip.php', {
       method: 'POST',
       headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        // body : 
        body: JSON.stringify({
				employeeID: this.state.employeeID,
				employeeName: this.state.employeeName,
				startedOn: res[0].formattedAddress,
				startLat: location.latitude,
				startLong: location.longitude,
				startTime: new Date().getDate() +"/"+ parseInt(new Date().getMonth()+1) +"/"+ new Date().getFullYear() +" "+ new Date().getHours() +":"+ new Date().getMinutes() +":"+ new Date().getSeconds(),
				status: 'On Trip',
				tanggal: new Date().getDate() +"/"+ parseInt(new Date().getMonth()+1) +"/"+ new Date().getFullYear(),
				company: this.state.companyCode
             })
        })
        .then((response) => response.json())
        .then((responseJson) => {
                 if(responseJson === 'Success') {
					  console.log('[INFO] App is in foreground');
                        Alert.alert(
						'Drive Started',
						'Utamakan Keselamatan!',
						[
							{text: 'Ok', onPress: () => BackHandler.exitApp()},
						],
							{ cancelable: false });
						return true;
                    }else{
                      
                      console.log('[INFO] App is in foreground');
                    
                            }

        }).done();
        return false;
			})
			.catch(err => console.log(err))
	  });
    });

    BackgroundGeolocation.on('stop', () => {
      if (this._isMounted) {this.setState({ isRunning: false });}
	  BackgroundGeolocation.getCurrentLocation((location) => {
		// Position Geocoding
			var NY = {
				lat: location.latitude,
				lng: location.longitude
			};

			Geocoder.geocodePosition(NY).then(res => {
				// res is an Array of geocoding object (see below)
				fetch('http://103.247.10.156/~heiteknologi/api/Finish_Trip.php', {
       method: 'POST',
       headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        // body : 
        body: JSON.stringify({
				employeeID: this.state.employeeID,
				finishOn: res[0].formattedAddress,
				finishLat: location.latitude,
				finishLong: location.longitude,
				finishTime: new Date().getDate() +"/"+ parseInt(new Date().getMonth()+1) +"/"+ new Date().getFullYear() +" "+ new Date().getHours() +":"+ new Date().getMinutes() +":"+ new Date().getSeconds(),
				duration: this.state.duration,
				distance: this.state.distance,
				status: 'On Trip'
             })
        })
        .then((response) => response.json())
        .then((responseJson) => {
                 if(responseJson === 'Success') {
					  console.log('[INFO] App is in foreground');
					  BackgroundGeolocation.deleteAllLocations()
                    }else{
                      
                      console.log('[INFO] App is in foreground');
                    
                            }

        }).done();
			})
			.catch(err => console.log(err))
	  });
    });

    BackgroundGeolocation.on('authorization', status => {
      //console.log( '[INFO] BackgroundGeolocation authorization status: ' + status );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        // we need to set delay after permission prompt or otherwise alert will not be shown
        setTimeout(() =>
          Alert.alert(
            'App requires location tracking',
            'Would you like to open app settings?',
            [
              {
                text: 'Yes',
                onPress: () => BackgroundGeolocation.showAppSettings()
              },
              {
                text: 'No',
                onPress: () => console.log('No Pressed'),
                style: 'cancel'
              }
            ]
        ), 1000);
      }
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.checkStatus(({ isRunning }) => {
      if (this._isMounted) { this.setState({ isRunning });}
    });
	
  }

  componentWillUnmount() {
    this._isMounted = false;
	  BackgroundGeolocation.removeAllListeners();
	  BackgroundGeolocation.events.forEach(event =>
		BackgroundGeolocation.removeAllListeners(event)
	  );
  }

  toggleTracking() {
    BackgroundGeolocation.checkStatus(({ isRunning, locationServicesEnabled, authorization }) => {
      if (isRunning) {
        BackgroundGeolocation.stop();
        return false;
      }

      if (!locationServicesEnabled) {
        Alert.alert(
          'Location services disabled',
          'Would you like to open location settings?',
          [
            {
              text: 'Yes',
              onPress: () => BackgroundGeolocation.showLocationSettings()
            },
            {
              text: 'No',
              onPress: () => console.log('No Pressed'),
              style: 'cancel'
            }
          ]
        );
        return false;
      }

      if (authorization == 99) {
        // authorization yet to be determined
        BackgroundGeolocation.start();
      } else if (authorization == BackgroundGeolocation.AUTHORIZED) {
        // calling start will also ask user for permission if needed
        // permission error will be handled in permisision_denied event
        BackgroundGeolocation.start();
      } else {
        Alert.alert(
          'App requires location tracking',
          'Please grant permission',
          [
            {
              text: 'Ok',
              onPress: () => BackgroundGeolocation.start()
            }
          ]
        );
      }
    });
  }
  
  render() {
	  if (this.state.isLoading) {
        return (
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        );
      }
	const { height, width } = Dimensions.get('window');
	const { locations, stationaries, region, isRunning } = this.state;
    return (
      <Container>
        <Content>
          <MapView style={{ width, height }} region={region}>
            {locations.map((location, idx) => (
              <MapView.Marker
                key={idx}
                coordinate={location}
                image={TrackingDot}
              />
            ))}
            {stationaries.map((stationary, idx) => {
              return (
                <MapView.Circle
                  key={idx}
                  center={stationary}
                  radius={stationary.radius}
                  fillColor="#AAA"
                />
              );
            })}
          </MapView>
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
StartTrip.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title> Driving</Title>
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
  icon: {
    color: '#fff',
    fontSize: 30
  },
  footerBottom: {
    backgroundColor: '#fff',
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