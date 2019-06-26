import React from "react";
import { StyleSheet, AppRegistry, Alert, View, Platform, BackHandler, DeviceEventEmitter, Dimensions, AsyncStorage, TouchableOpacity, ActivityIndicator } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Label, Form, Item, Input, Footer, FooterTab } from "native-base";
import { StackNavigator, StackActions, NavigationActions } from 'react-navigation';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import DeviceInfo from 'react-native-device-info';
import MapView, { Marker, AnimatedRegion, Animated } from 'react-native-maps';
import { regionFrom, getLatLonDiffInMeters } from '../../config/CheckLokasi';
import Geocoder from 'react-native-geocoder';
import moment from "moment";

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class CheckIn extends React.Component {
	_isMounted = false;
	constructor(props) {
  super(props);
  
  this.state = {
	isLoading: true,
	deviceID: '',
	branch: '',
	branchLat : '',
	branchLong : '',
	branchRadius : '',
	logType: 'Check In',
	username: '',
	employeeID: '',
	employee: '',
	ClockAt: '',
	isClockingAllBranch: '',
	remarks: '',
	date: moment(new Date()).format("DD/MM/YYYY"),
	time: '',
	animating: true,
	latitude: '',
    longitude: '',
	companyCode: '',
	IsPremium: 'Y',
  };
  
  closeActivityIndicator = () => setTimeout(() => this.setState({ 
      animating: false }), 6000)
}

	InsertDataToServer = () =>{

      fetch('http://103.247.10.156/~heiteknologi/api/Attendance.php', {
       method: 'POST',
       headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        // body : 
        body: JSON.stringify({
				employeeID: this.state.employeeID,
			  ClockAt: this.state.ClockAt,
			  logType: this.state.logType,
			  username: this.state.username,
			  employee: this.state.employee,
			  remarks: this.state.remarks,
			  date: this.state.date,
			  time: this.state.time,
			  company: this.state.companyCode,
             })
        })
        .then((response) => response.json())
        .then((responseJson) => {
                 if(responseJson === 'Success') {
                      console.log(responseJson);
					  this.props.navigation.navigate("Attendance")
					  Alert.alert("Sukses", "Anda berhasil Check In");
                        
                    }else{
                      
                      Alert.alert('Check In gagal','Silakan coba lagi!');
                    
                            }

        }).done();
  }
			
  componentWillMount() {
	this._isMounted = true;
	  this.setState({deviceID: DeviceInfo.getUniqueID()});
	  this.intervalID = setInterval(
          () => this.tick(),
          1000
        );
		
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
		navigator.geolocation.getCurrentPosition(
      (position) => {
		  this.setState({
         latitude: position.coords.latitude,
         longitude: position.coords.longitude
       });
	   // Position Geocoding
			var NY = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			Geocoder.geocodePosition(NY).then(res => {
				this.setState({
					ClockAt: res[0].formattedAddress
				});// res is an Array of geocoding object (see below)
			})
			.catch(err => console.log(err))
      },
      (error) => this.setState({ error: error.message }),
      //{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );                 
            }.bind(this)
        ).catch((error) => {
            console.log(error.message);
        });
		
   AsyncStorage.getItem('username').then((data) => {
		let username = data;

		if (username !== null)
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
 
              this.setState({
 
                branch : responseJson[0].branch,
				employee : responseJson[0].name,
				username : responseJson[0].username,
				employeeID : responseJson[0].employeeID,
				isClockingAllBranch : responseJson[0].isClockingAllBranch,
				companyCode: responseJson[0].company,
 
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
			  this.getBranchRegion()
			  this.CheckClocking()
              
            }).catch((error) => {
              console.error(error);
            });
	});
  }
	
	CheckClocking = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/Check_Clocking.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              UserName: this.state.username,
			  logType: this.state.logType,
			  date: this.state.date
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
                 if(responseJson === 'Data Matched') {
                      console.log(responseJson);
					  Alert.alert("Maaf", "Anda sudah melakukan clocking in hari ini");
					  this.props.navigation.navigate("Attendance")
                        
                    }else{
                      
                      this.setState({ isLoading: false });
                    
                            }

        }).done();
			
	}
	
	getBranchRegion = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/Check_Branch.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              branch: this.state.branch,
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
 
              this.setState({
 
                branchLat : responseJson[0].latitude,
				branchLong : responseJson[0].longitude,
				branchRadius : responseJson[0].radius,
 
              })  
              
            }).catch((error) => {
              console.error(error);
            });
			
	}
	
	getDistance = () =>{
		if (this.state.isClockingAllBranch == 'Y') {
        // authorization yet to be determined
        this.InsertDataToServer()
      } else {
        var diff_in_meter_pickup = getLatLonDiffInMeters(
			this.state.latitude, this.state.longitude, 
			this.state.branchLat, this.state.branchLong);

		if(diff_in_meter_pickup <= this.state.branchRadius){

			this.InsertDataToServer()

		}else if(diff_in_meter_pickup => this.state.branchRadius){

			this.props.navigation.navigate("Attendance")
			Alert.alert("Gagal ", "Anda harus berada di lokasi cabang untuk check in");

		}
      }		
	}				
				
	componentWillUnmount() {
        // used only when "providerListener" is enabled
        LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
		clearInterval(this.intervalID);
    this._isMounted = false;
    }
	
	tick() {
        this.setState({
          time: new Date().getHours() +":"+ new Date().getMinutes() +":"+ new Date().getSeconds()
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
	  const checkin = [
      { name: 'Branch' }, { name: 'Time' },
    ];
    return (	
      <Container>
	  <Content style={styles.contentAttendance}>
          <Form style={styles.formCheckIn}>
            <Item fixedLabel>
              <Label>
                <Text style={styles.st_inputfnt}>Your Location: </Text>
				<Text style={styles.st_inputfnt}>{this.state.ClockAt}</Text>
              </Label>
            </Item>
            <Item fixedLabel>
              <Label>
                <Text style={styles.st_inputfnt}>Remarks :</Text>
              </Label>
              <Input style={styles.st_inputfnt} secureTextEntry={false} onChangeText={(text) => this.setState({remarks:text})}/>
            </Item>
            <Item fixedLabel>
              <Label>
                <Text style={styles.st_inputfnt}>Date : </Text>
				<Text style={styles.st_inputfnt}>{this.state.date}</Text>
              </Label>
            </Item>
            <Item fixedLabel>
              <Label>
                <Text style={styles.st_inputfnt}>Time : </Text>
				<Text style={styles.st_inputfnt}>{this.state.time}</Text>
              </Label>
            </Item>
          </Form>
            <Button block info style={styles.footerBottom} onPress={this.getDistance}>
              <Text>Check In</Text>
          </Button>
        </Content>
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
CheckIn.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title> Check In</Title>
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
	map: {
	position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 250,
  },
  contentAttendance : {
    marginTop : 10,
  },
  font1:{
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  center:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
  },
  footerBottom:{
    marginTop: 16,
    paddingTop: 10,
    marginLeft: 16,
    marginRight: 16,
	backgroundColor: '#0fa1d4',
  },
  formCheckIn : {
    marginTop :30,
    paddingLeft : 10,
    paddingRight : 30,
  },
  st_inputfnt:{
      color: '#000',
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