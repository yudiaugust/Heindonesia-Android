import React from "react";
import { StyleSheet, AppRegistry, AsyncStorage, Dimensions, Alert } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class Company extends React.Component {
	
	constructor(props) {
 super(props);
   this.state = {
	   id: '',
	   company: '',
	   address: '',
	   phoneNumber: '',
	   phoneNumber2: '',
	   fax: '',
	   email: ''
	   } 
}

  componentDidMount() {
    this.setState({id: DeviceInfo.getUniqueID()});
	this.state = {
      deviceID : ''
    }
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
 
                company : responseJson[0].company,
 
              })
			  this.getCompany()
              
            }).catch((error) => {
              console.error(error);
            });
	});
  }
  
  getCompany = () =>{
	
	fetch('http://103.247.10.156/~heiteknologi/api/Check_Company.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              company: this.state.company,
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
 
              this.setState({
 
                address : responseJson[0].address,
				phoneNumber : responseJson[0].phoneNumber,
				phoneNumber2 : responseJson[0].phoneNumber2,
				fax : responseJson[0].fax,
				email : responseJson[0].email,
 
              })
              
            }).catch((error) => {
              console.error(error);
            });
			
	}
	
  render() {
    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem>
              <Icon active name="paper-plane" />
              <Text>Company Information</Text>
            </CardItem>
            <CardItem>
              <Text>Company Name: {this.state.company}</Text>
            </CardItem>
            <CardItem>
              <Text>Email: {this.state.email}</Text>
            </CardItem>
            <CardItem>
              <Text>Address: {this.state.address}</Text>
            </CardItem>
            <CardItem>
              <Text>Primary phone: {this.state.phoneNumber}</Text>
            </CardItem>
            <CardItem>
              <Text>Second phone: {this.state.phoneNumber2}</Text>
            </CardItem>
            <CardItem>
              <Text>Fax: {this.state.fax}</Text>
            </CardItem>
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
Company.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Company</Title>
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