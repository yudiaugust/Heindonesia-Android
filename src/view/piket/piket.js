import React from "react";
import { StyleSheet, AppRegistry, AsyncStorage, Alert, ActivityIndicator, View, Image, Dimensions, ImageBackground, WebView } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Segment, Content, Right, Icon, Thumbnail, Button, Text, Tab, Tabs, List, ListItem, Separator, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class Piket extends React.Component {
	_isMounted = false;
  constructor(props) {
 super(props);
   this.state = {
		isLoading: true,
		employeeID: '',
		companyCode: '',
		IsPremium: 'Y',
		username: '',
		results: {
                items: []
				}
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
				employeeID: responseJson[0].employeeID,
				companyCode: responseJson[0].company
 
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
 
                IsPremium : responseJson[0].IsPremium
 
              })
              
            })
              this.getShift()
			  
            }).catch((error) => {
              console.error(error);
            });
    });
  }
  
  
  
  getShift = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/User_Shift.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              employeeID: this.state.employeeID,
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
 
              this.setState({
				  
				results: responseJson,
				isLoading: false
              })  
              
            }).catch((error) => {
              Alert.alert('Maaf','Work Shift belum ada!');
			  this.props.navigation.navigate("Home")
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
          <Card>
            <CardItem>
              <Icon active name="ios-clock-outline" />
              <Text>Your Work Shift</Text>
            </CardItem>
          </Card>
          <Card>
		  <List>
              <ListItem>
					<CardItem>
					<Left>
						<Text>Day</Text>
					</Left>
					<Body>
						<Text>IN</Text>
					</Body>
					<Right>
						<Text>OUT</Text>
					</Right>
					</CardItem>
              </ListItem>
          </List>
          <Card transparent>
			<List dataArray={this.state.results}
              renderRow={(item) =>
				<ListItem thumbnail>
					<CardItem>
					<Left>
						<Text style={styles.itemName}>{item.day}</Text>
					</Left>
					<Body>
						<Text style={styles.itemName}>{item.in}</Text>
					</Body>
					<Right>
						<Text style={styles.itemName}>{item.out}</Text>
					</Right>
					</CardItem>
				</ListItem>
              }>
			</List>
          </Card>
          </Card>
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

Piket.navigationOptions = ({ navigation }) => ({
  header: (
    <Header hasTabs style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Work Shift</Title>
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
  card:{
	backgroundColor: 'transparent',
  },
  header:{
	backgroundColor: '#0fa1d4',
  },
  button : {
    backgroundColor: 'transparent',
      left: "3%",
      width: "100%",
      height: "100%",
  },
  images:{
    backgroundColor: 'transparent',
	  top: 5,
	  left: 5,
      width: "25%",
      aspectRatio: 1/1,
	  borderRadius: 5
  },
  img: {
	flex: 1,
    width: Dimensions.get('window').width,
    position: 'absolute',
    left: 0,
	right: 0
  },
  itemName: {
    fontSize: 14,
    color: '#757373',
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