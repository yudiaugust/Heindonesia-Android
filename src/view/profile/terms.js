import React from "react";
import { StyleSheet, AppRegistry, Alert, View, ActivityIndicator, Dimensions, WebView, AsyncStorage } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Tab, Tabs, Button, Text, Input, Footer, Form, Item, Label, Thumbnail, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';
const DeviceWidth = Dimensions.get('window').width

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;


export default class Terms extends React.Component {
	constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
	   terms: '',
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
              this.GetAplikasi()
            }).catch((error) => {
              console.error(error);
            });
	});
  }

GetAplikasi = () =>{  
fetch('http://103.247.10.156/~heiteknologi/api/Check_Aplikasi.php')
         .then((response) => response.json())
         .then((responseJson) => {
           this.setState({
             terms: responseJson[0].terms,
			 isLoading: false
           });
         })
         .catch((error) => {
           console.error(error);
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
          <WebView
			originWhitelist={['*']}
			source={{html: this.state.terms}}
		  />
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

Terms.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Syarat dan Ketentuan</Title>
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
	left: 10,
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  itemProfile: {
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
  },
  st_inputfnt:{
      color: '#000',
  },
  formPassword : {
    marginTop :30,
    paddingLeft : 10,
    paddingRight : 30,
  },
  footerBottom:{
    marginTop: 16,
    paddingTop: 10,
    marginLeft: 16,
    marginRight: 16,
	backgroundColor: '#0fa1d4',
  }
});