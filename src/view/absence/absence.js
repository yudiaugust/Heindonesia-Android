import React from "react";
import { StyleSheet, AppRegistry, Alert, ActivityIndicator, View, BackHandler, Dimensions, AsyncStorage } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Segment, Content, Right, Icon, Button, Text, Tab, Tabs, List, ListItem, Separator, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';

const DeviceWidth = Dimensions.get('window').width

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class Absence extends React.Component {
	constructor(props) {
 super(props);
   this.state = {
		companyCode: '',
		IsPremium: 'Y',
	   } 
}
	componentDidMount() {
   AsyncStorage.getItem('username').then((data) => {
		let username = data;

		if (username !== null)
	fetch('http://192.168.43.172/~heiteknologi/api/Check_Employee.php', {
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
              
            });
	});
  }
  
  render() {
    return (
      <Container>
		<Tabs>
          <Tab heading="Pending">
            <Pending />
          </Tab>
          <Tab heading="Approved">
            <Approved />
          </Tab>
          <Tab heading="Rejected">
            <Rejected />
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

export class Pending extends React.Component {
	_isMounted = false;
  constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
	   deviceID: '',
	   employeeID: '',
	   requestStatus: 'Pending',
	   results: {
                items: []
				}
	   } 
}

componentWillMount() {
	this._isMounted = true;
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
				employeeID : responseJson[0].employeeID,
 
              })
			  
			  this.getAbsence()
              
            }).catch((error) => {
              
            });
	});
  }
  
  getAbsence = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/User_Absence.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              employeeID: this.state.employeeID,
			  requestStatus: this.state.requestStatus,
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
 
              this.setState({
				
				isLoading: false,  
				results: responseJson
 
              })  
              
            }).catch((error) => {
              Alert.alert('Maaf','Data tidak tersedia!');
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
              <Text>Pending Absence</Text>
            </CardItem>
          </Card>
          <Card>
		  <List>
              <ListItem>
					<CardItem>
					<Left>
						<Text>Reason</Text>
					</Left>
					<Body>
						<Text>Description</Text>
					</Body>
					<Right>
						<Text>Duration</Text>
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
						<Text style={styles.itemName}>{item.absenceReason}</Text>
					</Left>
					<Body>
						<Text style={styles.itemName}>{item.description}</Text>
					</Body>
					<Right>
						<Text style={styles.itemName}>{item.absenceFrom}</Text>
						<Text style={styles.itemName}>{item.absenceTo}</Text>
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

export class Approved extends React.Component {
	_isMounted = false;
  constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
	   deviceID: '',
	   employeeID: '',
	   requestStatus: 'Approved',
	   results: {
                items: []
				}
	   } 
}

componentWillMount() {
	_isMounted = true;
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
				employeeID : responseJson[0].employeeID,
 
              })
			  
			  this.getAbsence()
              
            }).catch((error) => {
              
            });
	});
  }
  
  getAbsence = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/User_Absence.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              employeeID: this.state.employeeID,
			  requestStatus: this.state.requestStatus,
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
 
              this.setState({
				  
				isLoading: false,  
				results: responseJson
 
              })  
              
            }).catch((error) => {
              console.error(error);
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
              <Text>Approved Absence</Text>
            </CardItem>
          </Card>
          <Card>
		  <List>
              <ListItem>
					<CardItem>
					<Left>
						<Text>Reason</Text>
					</Left>
					<Body>
						<Text>Description</Text>
					</Body>
					<Right>
						<Text>Duration</Text>
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
						<Text style={styles.itemName}>{item.absenceReason}</Text>
					</Left>
					<Body>
						<Text style={styles.itemName}>{item.description}</Text>
					</Body>
					<Right>
						<Text style={styles.itemName}>{item.absenceFrom}</Text>
						<Text style={styles.itemName}>{item.absenceTo}</Text>
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

export class Rejected extends React.Component {
	_isMounted = false;
  constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
	   deviceID: '',
	   employeeID: '',
	   requestStatus: 'Rejected',
	   results: {
                items: []
				}
	   } 
}

componentWillMount() {
	_isMounted = true;
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
				employeeID : responseJson[0].employeeID,
 
              })
			  
			  this.getAbsence()
              
            }).catch((error) => {
              
            });
        });
  }
  
  getAbsence = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/User_Absence.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              employeeID: this.state.employeeID,
			  requestStatus: this.state.requestStatus,
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
 
              this.setState({
				  
				isLoading: false,  
				results: responseJson
 
              })  
              
            }).catch((error) => {
              console.error(error);
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
              <Text>Rejected Absence</Text>
            </CardItem>
          </Card>
          <Card>
		  <List>
              <ListItem>
					<CardItem>
					<Left>
						<Text>Reason</Text>
					</Left>
					<Body>
						<Text>Description</Text>
					</Body>
					<Right>
						<Text>Duration</Text>
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
						<Text style={styles.itemName}>{item.absenceReason}</Text>
					</Left>
					<Body>
						<Text style={styles.itemName}>{item.description}</Text>
					</Body>
					<Right>
						<Text style={styles.itemName}>{item.absenceFrom}</Text>
						<Text style={styles.itemName}>{item.absenceTo}</Text>
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

Absence.navigationOptions = ({ navigation }) => ({
  header: (
    <Header hasTabs style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Absence</Title>
      </Body>
      <Right>
            <Button transparent onPress={() => navigation.navigate("AddAbsence")}>
              <Icon name="ios-add-circle" />
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