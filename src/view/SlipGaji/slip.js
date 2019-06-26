import React from "react";
import { StyleSheet, AppRegistry, Alert, View, AsyncStorage, Dimensions, ActivityIndicator, WebView } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Footer, List, ListItem, Thumbnail, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';
import moment from "moment";
import Numeral from "numeral";

//const month = props.navigation.state.params.bulan;
const DeviceWidth = Dimensions.get('window').width

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;
var textgaji = width * 0.03;

export default class Slip extends React.Component {
	constructor(props) {
	super(props);
	this.state = {
		isLoading: true,
		employeeID: '',
		employeeName: '',
		companyCode: '',
		IsPremium: 'Y',
		username: '',
		period: props.navigation.state.params.bulan,
		resultTunjangan: {
                items: []
				},
		resultPotongan: {
                items: []
				},
		total: '',
		potongan: '',
		terima: '',
		currentDate: new Date(),
		markedDate: moment(new Date()).format("YYYY-MM-DD")
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
 
                username : responseJson[0].username,
				employeeID : responseJson[0].employeeID,
				companyCode: responseJson[0].company,
				employeeName: responseJson[0].name
 
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
              this.getTunjangan()
			  this.getPotongan()
            })
            }).catch((error) => {
              console.error(error);
            });
	});
  }

  getTunjangan = () =>{
	  
	fetch('http://103.247.10.156/~heiteknologi/api/User_Payment.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              employeeID: this.state.employeeID,
			  period: this.state.period,
			  operator: '+'
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
				if(responseJson === 'No Results Found') {
					Alert.alert('Maaf','Slip Gaji bulan ini belum ada!');
					this.props.navigation.navigate("Filter")		
				}else{				  
					this.setState({
						resultTunjangan: responseJson
					})  
					this.totalTunj()						
				}
			  
            }).catch((error) => {
              console.error(error);
            });
			
	}

  getPotongan = () =>{
	  
	const today = this.state.currentDate;
	const day = moment(today).format("dddd");
	const date = moment(today).format("MMM-YY");
	fetch('http://103.247.10.156/~heiteknologi/api/User_Payment.php', {
       method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              employeeID: this.state.employeeID,
			  period: this.state.period,
			  operator: '-'
             })
       
      }).then((response) => response.json())
            .then((responseJson) => {
				if(responseJson === 'No Results Found') {
				  this.setState({
					isLoading: false
				  })
				  this.totalTerima ()
							
				}else{
				  this.setState({
					resultPotongan: responseJson,
					isLoading: false
				  })  
				  this.potonganTunj()
				  this.totalTerima ()
						
				}
			  
            }).catch((error) => {
              console.error(error);
            });
			
	}

totalTunj = () => {
  const { resultTunjangan } = this.state;
  let sum = 0;
  resultTunjangan.forEach((item) => {
	sum += item.nominal * 1;
  })
  this.setState({
    total: Number(sum)
  });
}

potonganTunj = () => {
  const { resultPotongan } = this.state;
  let sum = 0;
  resultPotongan.forEach((item) => {
	sum += item.nominal * 1;
  })
  this.setState({
	potongan: Number(sum)
  });
}

totalTerima = () => {
	if (this.state.potongan >= 1) {
	  this.setState({
		terima:  Number(this.state.total) - Number(this.state.potongan)
	  });
	}else {
		this.setState({
			terima:  Number(this.state.total)
		});
	}
}

  render() {
	  if (this.state.isLoading) {
        return (
          <View style={{flex: 1, paddingTop: 20}}>
            <ActivityIndicator />
          </View>
        );
      }
	  
	const today = this.state.currentDate;
	const day = moment(today).format("dddd");
	const date = moment(today).format("MMM-YY");
	
	const totalTunj = Numeral(this.state.total).format("0,000");
	const potongan = Numeral(this.state.potongan).format("0,000");
	const terima = Numeral(this.state.terima).format("0,000");
    return (
      <Container>
		<Content padder>
          <Card>
            <CardItem>
              <Icon active name="ios-clock-outline" />
              <Text>Payment Slip</Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem>
				<Text style={styles.itemName}>Period:</Text>
				<Text style={styles.itemName}> {this.state.period}</Text>
            </CardItem>
            <CardItem>
				<Text style={styles.itemName}>NIK:</Text>
				<Text style={styles.itemName}> {this.state.employeeID}</Text>
            </CardItem>
            <CardItem>
				<Text style={styles.itemName}>Name:</Text>
				<Text style={styles.itemName}> {this.state.employeeName}</Text>
            </CardItem>
			<View style={{ flexDirection: 'row'}}>
				<Card transparent style={{width: '50%', backgroundColor: 'white'}}>
					<List>
						<ListItem>
							<Text style={styles.itemName}>Tunjangan</Text>
						</ListItem>
					</List>
					<List dataArray={this.state.resultTunjangan} renderRow={(item) =>
						<ListItem thumbnail>
							<Left>
								<Text style={styles.itemName}>{item.type}</Text>
							</Left>
							<Body>
								<Text style={styles.itemName}> </Text>
							</Body>
							<Right>
								<Text style={styles.itemName}>{Numeral(item.nominal).format("0,000")}</Text>
							</Right>
						</ListItem>
					  }>
					</List>
					<List>
						<ListItem thumbnail>
							<Left>
								<Text style={styles.itemName}>Total</Text>
							</Left>
							<Body>
								<Text style={styles.itemName}> </Text>
							</Body>
							<Right>
								<Text style={styles.itemName}>{totalTunj}</Text>
							</Right>
						</ListItem>
					</List>
				</Card>
				<Card transparent style={{width: '50%', backgroundColor: 'white'}}>
					<List>
						<ListItem>
							<Text style={styles.itemName}>Potongan</Text>
						</ListItem>
					</List>
					<List dataArray={this.state.resultPotongan} renderRow={(item) =>
						<ListItem thumbnail>
							<Left>
								<Text style={styles.itemName}>{item.type}</Text>
							</Left>
							<Body>
								<Text style={styles.itemName}> </Text>
							</Body>
							<Right>
								<Text style={styles.itemName}>{Numeral(item.nominal).format("0,000")}</Text>
							</Right>
						</ListItem>
					  }>
					</List>
					<List>
						<ListItem>
							<Left>
								<Text style={styles.itemName}>Total</Text>
							</Left>
							<Body>
								<Text style={styles.itemName}>{potongan}</Text>
							</Body>
						</ListItem>
					</List>
				</Card>
			</View>
			<CardItem>
				<Left>
					<Text style={styles.itemName}>Diterima</Text>
				</Left>
				<Right>
					<Text style={styles.itemName}>{terima}</Text>
				</Right>
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
Slip.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Slip Gaji</Title>
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
    fontSize: textgaji,
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