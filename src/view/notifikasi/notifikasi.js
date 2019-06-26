import React from "react";
import { StyleSheet, AppRegistry, Alert, Dimensions, AsyncStorage, View } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Form, Input, Item, Label, Footer, FooterTab, List, ListItem, Separator } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class Notifikasi extends React.Component {
	
constructor(props) {
	super(props);
	this.state = {
	   deviceID: '',
	   employeeID: '',
	   company: '',
	   notifikasi: {
            items: []
			},
	} 
}

  componentDidMount() {
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
				company : responseJson[0].company,
              })
              this.getNotifikasi()
            }).catch((error) => {
              console.error(error);
            });
    });
  }

  getNotifikasi = () =>{
	  
	fetch('http://103.247.10.156/~heiteknologi/api/notifikasi.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              company: this.state.company
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
				if(responseJson === 'No Results Found') {
					Alert.alert('Maaf','Tidak ada pesan!');
					this.props.navigation.navigate("Home")		
				}else{				  
					this.setState({
						notifikasi: responseJson
					})  
											
				}
			  
            }).catch((error) => {
              console.error(error);
            });
			
	}

  render() {
    return (
      <Container>
        <Content padder>
			<List dataArray={this.state.notifikasi} renderRow={(item) =>
				<ListItem icon>
					<Left>
						<Icon active name="ios-notifications" style={styles.icon}/>
					</Left>
					<Body>
						<Text style={styles.itemName} onPress={() => this.props.navigation.navigate('Detail', { id: item.id })}>{item.topik}</Text>
					</Body>
					<Right>
						<Text style={styles.itemName}>{item.tanggal}</Text>
					</Right>
				</ListItem>
			  }>
			</List>
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
Notifikasi.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Notifikasi</Title>
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
    color: '#0fa1d4',
    fontSize: 28
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