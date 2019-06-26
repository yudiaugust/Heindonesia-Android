import React from "react";
import { StyleSheet, AppRegistry, AsyncStorage, Alert, ActivityIndicator, Image, Dimensions, View } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Segment, Content, Right, Icon, Thumbnail, Button, Text, Tab, Tabs, List, ListItem, Separator, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';

const DeviceWidth = Dimensions.get('window').width

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class Attendance extends React.Component {
	_isMounted = false;
  constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
		companyCode: '',
		IsPremium: 'Y',
	   username: '',
	   } 
}

componentWillMount() {
	this._isMounted = true;
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
				username : responseJson[0].username,
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
				isLoading: false
 
              })
              
            })
              
            }).catch((error) => {
              console.error(error);
            });
    });
  }
componentWillUnmount() {
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
        <Content padder>
		<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', top: 2 }}>
			<View>
				<Card style={{width: DeviceWidth*0.25, height: DeviceWidth*0.35, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("CheckIn")}>
							<Image style={styles.images} source={require( '../../assets/images/in.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Check In</Text>
				</Card>
				<Card style={{width: DeviceWidth*0.25, height: DeviceWidth*0.35, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("BreakOut")}>
							<Image style={styles.images} source={require( '../../assets/images/break_out.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Break Out</Text>
				</Card>
			</View>
			<View>
				<Card style={{width: DeviceWidth*0.25, height: DeviceWidth*0.35, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("CheckOut")}>
							<Image style={styles.images} source={require( '../../assets/images/out.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Check Out</Text>
				</Card>
				<Card style={{width: DeviceWidth*0.25, height: DeviceWidth*0.35, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("OvertimeIn")}>
							<Image style={styles.images} source={require( '../../assets/images/lembur_in.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Overtime In</Text>
				</Card>
			</View>
			<View>
				<Card style={{width: DeviceWidth*0.25, height: DeviceWidth*0.35, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("BreakIn")}>
							<Image style={styles.images} source={require( '../../assets/images/break_in.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Break In</Text>
				</Card>
				<Card style={{width: DeviceWidth*0.25, height: DeviceWidth*0.35, marginBottom:5, marginLeft:5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
					<View>
						<Button transparent style={styles.button} onPress={() => this.props.navigation.navigate("OvertimeOut")}>
							<Image style={styles.images} source={require( '../../assets/images/lembur_out.png')} />
						</Button>
					</View>
					<Text style={styles.itemName}>Overtime Out</Text>
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

Attendance.navigationOptions = ({ navigation }) => ({
  header: (
    <Header hasTabs style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Attendance</Title>
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
      backgroundColor: '#fff',
      width: "100%",
      aspectRatio: 1/1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  images:{
      width: "100%",
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
  penawaran: {
	left: 10,
	bottom: 10,
    fontSize: 16,
    color: '#000',
  },
  notif: {
    color: '#fff',
    fontSize: 28
  },
  homemenu: {
	top: 5,
	left: 10,
    fontSize: 16,
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