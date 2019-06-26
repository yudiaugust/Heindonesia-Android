import React from "react";
import { StyleSheet, AppRegistry, AsyncStorage, Alert, ActivityIndicator, View, Image, Dimensions, ImageBackground, Linking  } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Segment, Content, Right, Icon, Form, Item, Picker, Input, Textarea, Label, Thumbnail, Button, Text, Tab, Tabs, List, ListItem, Separator, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';

const DeviceWidth = Dimensions.get('window').width

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class Bantuan extends React.Component {
	_isMounted = false;
  constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
		company: '',
		IsPremium: 'Y',
	    username: '',
		topik: undefined,
		employeeID: '',
		employeeName: '',
		pesan: '',
		hubungi: '',
		HelpTopik: {
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
				company: responseJson[0].company,
				employeeID: responseJson[0].employeeID,
				employeeName: responseJson[0].name
              })
			  fetch('http://103.247.10.156/~heiteknologi/api/Check_Company.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              companyCode: this.state.company,
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
          this.setState({
 
                 IsPremium : responseJson[0].IsPremium,
 
              })
              
            })
             this.HelpTopik() 
            }).catch((error) => {
              console.error(error);
            });
    });
  }

HelpTopik = () =>{  
fetch('http://103.247.10.156/~heiteknologi/api/Check_Topik.php')
         .then((response) => response.json())
         .then((responseJson) => {
           this.setState({
             HelpTopik: responseJson,
			 isLoading: false
           });
         })
         .catch((error) => {
           console.error(error);
         });
}

  
	kirimMail = () =>{
		Linking.openURL('mailto:hello@heindonesia.com').catch((err) => console.error('An error occurred', err));		
	}
	
	telepon=()=>{
		const url='tel:+6289636076626'
		Linking.openURL(url)
	}
	
	InsertDataToServer = () =>{

      fetch('http://103.247.10.156/~heiteknologi/api/support.php', {
       method: 'POST',
       headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        // body : 
        body: JSON.stringify({
			  company: this.state.company,
			  employeeID: this.state.employeeID,
			  employeeName: this.state.employeeName,
			  topik: this.state.topik,
			  pesan: this.state.pesan
             })
        })
        .then((response) => response.json())
        .then((responseJson) => {
                 if(responseJson === 'Success') {
                      console.log(responseJson);
					  this.props.navigation.navigate("Home")
					  Alert.alert("Sukses", "Pesan anda telah terkirim, kami akan menghubungi anda");
                        
                    }else{
                      
                      Alert.alert('Pesan gagal dikirim','Silakan coba lagi!');
                    
                            }

        }).done();
  }
	
componentWillUnmount() {
    this._isMounted = false;
  }

  pilihTopik(value: string) {
    this.setState({
      topik: value
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
		<Content>
		  <Form>
			<Card>
				<CardItem style={styles.card}>
					<View>
						<Text style={styles.itemName}>Hubungi Saya</Text>
					</View>
				</CardItem>
				<CardItem style={styles.card}>
					<Item picker>
						<Picker
							mode="dropdown"
							iosIcon={<Icon name="arrow-down" />}
							style={{ width: "90%" }}
							placeholder="Pilih Topik"
							placeholderStyle={{ color: "#bfc6ea" }}
							placeholderIconColor="#007aff"
							selectedValue={this.state.topik}
							onValueChange={this.pilihTopik.bind(this)}
						>
							{ this.state.HelpTopik.map((items, key)=>(
							<Picker.Item label={items.topik} value={items.topik} key={key} />)
							)}
						</Picker>
					</Item>
				</CardItem>
				<CardItem style={styles.card}>
					<Item stackedLabel>
						<Label>No Nip</Label>
						<Input onChangeText={(text) => this.setState({employeeID:text})}>{this.state.employeeID}</Input>
					</Item>
				</CardItem>
				<CardItem style={styles.card}>
					<Item stackedLabel>
						<Label>Nama</Label>
						<Input onChangeText={(text) => this.setState({employeeName:text})}>{this.state.employeeName}</Input>
					</Item>
				</CardItem>
				<CardItem style={styles.card}>
					<Item stackedLabel>
						<Label>Pesan Anda </Label>
						<Input onChangeText={(text) => this.setState({pesan:text})} />
					</Item>
				</CardItem>
				<CardItem style={styles.hubungiCard}>
					<Button block info style={styles.hubungiButton} onPress={this.InsertDataToServer}>
						<Text>HUBUNGI SAYA</Text>
					</Button>
				</CardItem>
			</Card>
		  </Form>
		  <Card>
			<CardItem>
				<View>
					<Text style={styles.itemName}>Hubungi Admin</Text>
				</View>
			</CardItem>
			<Card style={styles.cardAdmin}>
				<CardItem bordered>
					<Icon active name="mail" />
					<Text onPress={this.kirimMail}>hello@heindonesia.com</Text>
					<Right>
						<Icon name="arrow-forward" />
					</Right>
				</CardItem>
			</Card>
			<Card style={styles.cardAdmin}>
				<CardItem bordered>
					<Icon active name="ios-phone-portrait" />
					<Text onPress={this.telepon}>+62 896-3607-6626</Text>
					<Right>
						<Icon name="arrow-forward" />
					</Right>
				</CardItem>
			</Card>
			<Card style={styles.cardAddress}>
				<CardItem bordered>
					<Icon active name="ios-mail-outline" />
					<Text>Heindonesia{'\n'}{'\n'}Puri Indah Financial Tower, {'\n'}Kota Jakarta Barat, {'\n'}Daerah Khusus Ibukota Jakarta</Text>
				</CardItem>
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

Bantuan.navigationOptions = ({ navigation }) => ({
  header: (
    <Header hasTabs style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Bantuan</Title>
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
	width: "95%",
  },
  cardAdmin:{
	backgroundColor: 'transparent',
	borderColor: '#0fa1d4',
	left: 5,
	width: "95%",
  },
  cardAddress:{
	backgroundColor: 'transparent',
	borderColor: '#0fa1d4',
	left: 5,
	width: "95%",
  },
  header:{
	backgroundColor: '#0fa1d4',
  },
  hubungiCard:{
	backgroundColor: 'transparent',
	justifyContent: 'center',
	alignItems: 'center',
  },
  hubungiButton:{
	backgroundColor: '#0fa1d4',
	justifyContent: 'center',
	alignItems: 'center',
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