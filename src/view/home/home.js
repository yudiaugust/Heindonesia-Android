import React from "react";
import { StyleSheet, StatusBar, TouchableOpacity, View, ActivityIndicator, Image, Dimensions, Alert, AsyncStorage, BackHandler } from "react-native";
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Thumbnail, List, ListItem, Footer, FooterTab } from "native-base";
import { DrawerNavigator } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import Geocoder from 'react-native-geocoder';
import Carousel from 'react-native-banner-carousel';
import { Col, Row, Grid } from 'react-native-easy-grid';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 500;
const DeviceWidth = Dimensions.get('window').width

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class HomeScreen extends React.Component {
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
		department: '',
		IsPremium: 'Y',
		banner1: '',
		banner2: '',
		banner3: '',
	   }   
}

componentDidMount() {
	this._isMounted = true;
	BackHandler.addEventListener('hardwareBackPress', this.backPressed);
	
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
				department: responseJson[0].department
              })
			
			fetch('http://103.247.10.156/~heiteknologi/api/banner.php', {
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
 
                banner1 : responseJson[0].images1,
				banner2 : responseJson[0].images2,
				banner3 : responseJson[0].images3,
				isLoading: false
 
              })
              
            })
              
			  }
              
            }).catch((error) => {
			  this.props.navigation.navigate("Login")
            }).done();
	});
	  
  }

  componentWillUnmount() {
    this._isMounted = false;
	  BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  }
  
  backPressed = () => {
  Alert.alert(
    'Exit App',
    'Anda Yakin akan keluar?',
    [
      {text: 'Batal', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
      {text: 'Keluar', onPress: () => BackHandler.exitApp()},
    ],
    { cancelable: false });
    return true;
}
renderPage(image, index) {
        return (
            <View key={index}>
                <Image style={{ width: "92%", height: 180, marginLeft:3, borderRadius: 5 }} source={{ uri: image }} />
            </View>
        );
    }
  render() {
	  if (this.state.isLoading) {
        return (
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        );
      }
	
	const { locations, stationaries, region, isRunning } = this.state;
	
	const images = [
    'http://103.247.10.156/~heiteknologi/carousel/' + (this.state.banner1),
    'http://103.247.10.156/~heiteknologi/carousel/' + (this.state.banner2),
    'http://103.247.10.156/~heiteknologi/carousel/' + (this.state.banner3)
];
    return (
      <Container>
        <Header style={styles.header}>
          <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Title style={{ justifyContent: 'center', alignItems: 'center' }}>Heindonesia</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.navigation.navigate("Notifikasi")}>
              <Icon name='ios-notifications' style={styles.notif} />
            </Button>
          </Right>
        </Header>
		<Content padder>
		<Card>
			<CardItem>
				<Text style={styles.welcome}>Welcome </Text>
				<Right>
					<Text style={styles.welcome}>{this.state.employeeName}</Text>
				</Right>
            </CardItem>
			<List>
				<ListItem thumbnail>
					<Left>
						<Text style={{fontSize: 14, color: '#757373', fontWeight: '600'}}>{this.state.employeeID}</Text>
					</Left>
				</ListItem>
				<ListItem thumbnail>
					<Left>
						<Text style={{fontSize: 14, color: '#757373', fontWeight: '600'}}>{this.state.branch}</Text>
					</Left>
					<Body>
						<Text style={{fontSize: 14, color: '#757373', fontWeight: '600'}}> </Text>
					</Body>
					<Right>
						<Text style={{fontSize: 14, color: '#757373', fontWeight: '600'}}>{this.state.email}</Text>
					</Right>
				</ListItem>
			</List>
		</Card>
		<Card transparent style={{ flexDirection: 'row' }}>
			<View>
				<Text style={styles.penawaran}>Berita Terbaru</Text>
			</View>
		</Card>
		<Card transparent style={styles.carousel}>
			<Carousel
				autoplay
				autoplayTimeout={5000}
				loop
				index={0}
				pageSize={BannerWidth}
			>
				{images.map((image, index) => this.renderPage(image, index))}
			</Carousel>
		</Card>
		<Card transparent style={{ flexDirection: 'row' }}>
			<View>
				<Text style={styles.homemenu}>Service</Text>
			</View>
		</Card>
		<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 2 }}>
			<View>
				<Card style={{width: DeviceWidth*0.21, height: DeviceWidth*0.21, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("Attendance")}>
							<Image style={styles.images} source={require( '../../assets/images/attendance.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Attendance</Text>
				</Card>
				<Card style={{width: DeviceWidth*0.21, height: DeviceWidth*0.21, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("Piket")}>
							<Image style={styles.images} source={require( '../../assets/images/shift.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Work Shift</Text>
				</Card>
			</View>
			<View>
				<Card style={{width: DeviceWidth*0.21, height: DeviceWidth*0.21, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("Absence")}>
							<Image style={styles.images} source={require( '../../assets/images/absen.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Absence</Text>
				</Card>
				<Card style={{width: DeviceWidth*0.21, height: DeviceWidth*0.21, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("Filter")}>
							<Image style={styles.images} source={require( '../../assets/images/slip.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Slip Gaji</Text>
				</Card>
			</View>
			<View>
				<Card style={{width: DeviceWidth*0.21, height: DeviceWidth*0.21, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("Pinjaman")}>
							<Image style={styles.images} source={require( '../../assets/images/loan.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Pinjaman</Text>
				</Card>
				<Card style={{width: DeviceWidth*0.21, height: DeviceWidth*0.21, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("History")}>
							<Image style={styles.images} source={require( '../../assets/images/history.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>History</Text>
				</Card>
			</View>
			<View>
				<Card style={{width: DeviceWidth*0.21, height: DeviceWidth*0.21, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("Claim")}>
							<Image style={styles.images} source={require( '../../assets/images/claim.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Claim</Text>
				</Card>
				<Card style={{width: DeviceWidth*0.21, height: DeviceWidth*0.21, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("StartTrip")}>
							<Image style={styles.images} source={require( '../../assets/images/trip.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Drive Mode</Text>
				</Card>
			</View>
		</View>
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

const styles = StyleSheet.create({
  carousel: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
  header:{
	backgroundColor: '#0fa1d4',
      alignItems: 'center',
      justifyContent: 'center',
  },
  button : {
      backgroundColor: '#fff',
      width: "100%",
      aspectRatio: 1/1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  images:{
      width: "90%",
      aspectRatio: 1/1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  itemName: {
	top: 5,
	bottom: 5,
    fontSize: 12,
    color: '#757373',
  },
  welcome: {
    fontSize: 16,
    color: '#000',
	fontWeight: '600',
  },
  penawaran: {
	left: 5,
	bottom: 5,
    fontSize: 16,
    color: '#000',
	fontWeight: '600',
  },
  notif: {
    color: '#fff',
    fontSize: 28
  },
  homemenu: {
	top: 3,
	left: 5,
    fontSize: 16,
    color: '#000',
	fontWeight: '600',
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
