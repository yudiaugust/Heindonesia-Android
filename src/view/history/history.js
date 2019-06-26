import React from "react";
import { StyleSheet, AppRegistry, AsyncStorage, View, ActivityIndicator, Dimensions, Alert } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Tab, Tabs, List, ListItem, Separator, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';

var today = new Date();

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class History extends React.Component {
	constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
		companyCode: '',
		IsPremium: 'Y',
	   } 
}
	componentDidMount() {
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
 
                IsPremium : responseJson[0].IsPremium,
				isLoading: false
 
              })
              
            })
              
            }).catch((error) => {
              console.error(error);
            });
	});
  }
  
  render() {
    return (
      <Container>
		<Tabs>
          <Tab heading="Clocking">
            <Clocking />
          </Tab>
          <Tab heading="Break">
            <Break />
          </Tab>
          <Tab heading="Overtime">
            <Overtime />
          </Tab>
        </Tabs>
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

export class Clocking extends React.Component {
  constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
	   deviceID: '',
	   username: '',
	   results: {
                items: []
				},
		month: parseInt(today.getMonth()+1) +"/"+ today.getFullYear(),
		companyCode: '',
		IsPremium: 'Y',
	   } 
}

componentWillMount() {
	  this.setState({deviceID: DeviceInfo.getUniqueID()});
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
 
              })
              
            })
			  this.getAttendance()
              
            }).catch((error) => {
              console.error(error);
            });
    });
  }
  
  getAttendance = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/User_Attendance.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              UserName: this.state.username,
			  month: this.state.month
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
 
              this.setState({
				  
				results: responseJson,
				isLoading: false
 
              })  
              
            }).catch((error) => {
              Alert.alert('Maaf','History Clocking bulan ini tidak ada!');
			  this.props.navigation.navigate("Home")
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
    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem>
              <Icon active name="ios-clock-outline" />
              <Text>Clocking Time {this.state.month}</Text>
            </CardItem>
          </Card>
          <Card>
		  <List>
              <ListItem>
					<CardItem>
					<Left>
						<Text>Check In</Text>
					</Left>
					<Body>
						<Text>Check Out</Text>
					</Body>
					<Right>
						<Text>Date</Text>
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
						<Text style={styles.itemName}>{item.CheckIn}</Text>
					</Left>
					<Body>
						<Text style={styles.itemName}>{item.CheckOut}</Text>
					</Body>
					<Right>
						<Text style={styles.itemName}>{item.Date}</Text>
					</Right>
					</CardItem>
				</ListItem>
              }>
			</List>
          </Card>
          </Card>
        </Content>
      </Container>
    );
  }
}

export class Break extends React.Component {
  constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
	   deviceID: '',
	   username: '',
	   results: {
                items: []
				},
		month: parseInt(today.getMonth()+1) +"/"+ today.getFullYear(),
		companyCode: '',
		IsPremium: 'Y',
	   } 
}

componentWillMount() {
	  this.setState({deviceID: DeviceInfo.getUniqueID()});
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
 
              })
              
            })
			  this.getAttendance()
              
            }).catch((error) => {
              console.error(error);
            });
    });
  }
  
  getAttendance = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/User_Attendance.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              UserName: this.state.username,
			  month: this.state.month
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
 
              this.setState({
				  
				results: responseJson,
				isLoading: false
 
              })  
              
            }).catch((error) => {
              Alert.alert('Maaf','History Clocking bulan ini tidak ada!');
			  this.props.navigation.navigate("Home")
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
    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem>
              <Icon active name="ios-clock-outline" />
              <Text>Break Time {this.state.month}</Text>
            </CardItem>
          </Card>
          <Card>
		  <List>
              <ListItem>
					<CardItem>
					<Left>
						<Text>Break In</Text>
					</Left>
					<Body>
						<Text>Break Out</Text>
					</Body>
					<Right>
						<Text>Date</Text>
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
						<Text style={styles.itemName}>{item.BreakIn}</Text>
					</Left>
					<Body>
						<Text style={styles.itemName}>{item.BreakOut}</Text>
					</Body>
					<Right>
						<Text style={styles.itemName}>{item.Date}</Text>
					</Right>
					</CardItem>
				</ListItem>
              }>
			</List>
          </Card>
          </Card>
        </Content>
      </Container>
    );
  }
}

export class Overtime extends React.Component {
  constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
	   deviceID: '',
	   username: '',
	   results: {
                items: []
				},
		month: parseInt(today.getMonth()+1) +"/"+ today.getFullYear(),
		companyCode: '',
		IsPremium: 'Y',
	   } 
}

componentWillMount() {
	  this.setState({deviceID: DeviceInfo.getUniqueID()});
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
 
              })
              
            })
			  this.getAttendance()
              
            }).catch((error) => {
              console.error(error);
            });
    });
  }
  
  getAttendance = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/User_Attendance.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              UserName: this.state.username,
			  month: this.state.month
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
 
              this.setState({
				  
				results: responseJson,
				isLoading: false
 
              })  
              
            }).catch((error) => {
              Alert.alert('Maaf','History Clocking bulan ini tidak ada!');
			  this.props.navigation.navigate("Home")
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
    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem>
              <Icon active name="ios-clock-outline" />
              <Text>Overtime {this.state.month}</Text>
            </CardItem>
          </Card>
          <Card>
		  <List>
              <ListItem>
					<CardItem>
					<Left>
						<Text>Overtime In</Text>
					</Left>
					<Body>
						<Text>Overtime Out</Text>
					</Body>
					<Right>
						<Text>Date</Text>
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
						<Text style={styles.itemName}>{item.OvertimeIn}</Text>
					</Left>
					<Body>
						<Text style={styles.itemName}>{item.OvertimeOut}</Text>
					</Body>
					<Right>
						<Text style={styles.itemName}>{item.Date}</Text>
					</Right>
					</CardItem>
				</ListItem>
              }>
			</List>
          </Card>
          </Card>
        </Content>
      </Container>
    );
  }
}

History.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>History</Title>
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