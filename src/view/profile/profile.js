import React from "react";
import { StyleSheet, AppRegistry, Alert, View, TouchableOpacity, ActivityIndicator, Dimensions, PixelRatio, AsyncStorage } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Tab, Tabs, Button, Text, Input, Footer, Form, Item, Label, Thumbnail, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';

const DeviceWidth = Dimensions.get('window').width

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class Profile extends React.Component {
	constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
	   avatar: '',
	   avatarSource: null,
	   data: null,
	   employee: '',
	   email: '',
	   username: '',
	   employeeID: '',
	   department: '',
	   birthDate: '',
	   address: '',
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
 
                avatar : responseJson[0].mediaID,
				employee : responseJson[0].name,
				email : responseJson[0].email,
				username : responseJson[0].username,
				employeeID : responseJson[0].employeeID,
				birthDate : responseJson[0].birthDate,
				address : responseJson[0].address,
				companyCode: responseJson[0].company,
				isLoading: false
 
              })
			                
            }).catch((error) => {
              console.error(error);
            });
	});
  }
	
	LogOut = () => {
			AsyncStorage.removeItem('username')
			this.props.navigation.navigate("Login")
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
        <Content>
          <Card>
            <CardItem style={{backgroundColor: 'white', width: "90%", height: 100, marginBottom:5, marginLeft:5, borderRadius: 50}}>
				{this.state.avatarSource === null ? (
					<Thumbnail source={{ uri: this.state.avatar }} style={{width: "30%", aspectRatio: 1 }}/>
				) : (
					<Thumbnail style={{width: "30%", aspectRatio: 1 }} source={this.state.avatar} />
				)}
				<View>
					<Text style={styles.itemName}>{this.state.username}</Text>
					<Text style={styles.itemName}>{this.state.employeeID}</Text>
					<Text style={styles.itemName}>{this.state.email}</Text>
				</View>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
				<View>
					<Text>Profile Saya</Text>
				</View>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
				<View>
					<Text>Nama Lengkap</Text>
					<Text style={styles.itemProfile}>{this.state.employee}</Text>
				</View>
            </CardItem>
            <CardItem>
				<View>
					<Text>NIP</Text>
					<Text style={styles.itemProfile}>{this.state.employeeID}</Text>
				</View>
            </CardItem>
            <CardItem>
				<View>
					<Text>Tanggal Lahir</Text>
					<Text style={styles.itemProfile}>{this.state.birthDate}</Text>
				</View>
            </CardItem>
            <CardItem>
				<View>
					<Text>Alamat</Text>
					<Text style={styles.itemProfile}>{this.state.address}</Text>
				</View>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
				<Icon active name="phone-portrait" />
				<Text onPress={() => this.props.navigation.navigate("Aplikasi")}>Tentang Aplikasi</Text>
            </CardItem>
            <CardItem>
				<Icon active name="hand" />
				<Text onPress={() => this.props.navigation.navigate("Terms")}>Syarat dan Ketentuan</Text>
            </CardItem>
          </Card>
            <Button block info style={styles.footerBottom} onPress={() => this.props.navigation.navigate("ChangePassword")}>
              <Text>Ubah Password</Text>
			</Button>
            <Button block info style={styles.footerBottom} onPress={this.LogOut}>
              <Text>Logout</Text>
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

Profile.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Akun Saya</Title>
      </Body>
      <Right />
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
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
	backgroundColor: '#0fa1d4',
  },
  avatar: {
    borderRadius: 5,
    width: 150,
    height: 50,
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