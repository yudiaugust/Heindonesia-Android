import React from "react";
import { StyleSheet, AppRegistry, Alert, Dimensions, AsyncStorage, View } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Input, Form, Item, Label, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';
import moment from "moment";
import DatePicker from 'react-native-datepicker';

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

const DeviceWidth = Dimensions.get('window').width

export default class Filter extends React.Component {
	
	constructor(props) {
        super(props);
 
        this.state = {
			employeeID: '',
            month: '',
			companyCode: ''
        }
    }
	
  componentWillMount() {
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
                companyCode : responseJson[0].company,
 
              })
              
            }).catch((error) => {
              console.error(error);
            }).done();
	});
  }

	handleSubmit = () => {
		const { month } = this.state;
		// perform all neccassary validations
		if (password !== confirmPassword) {
			Alert.alert("Warning", "Password tidak sama");
		} else {
			// make API call
			fetch('http://103.247.10.156/~heiteknologi/api/Update_Password.php', {
       method: 'POST',
       headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        // body : 
        body: JSON.stringify({
				employeeID: this.state.employeeID,
				password: this.state.password,
             })
        })
        .then((response) => response.json())
        .then((responseJson) => {
                 if(responseJson === 'Success') {
					  this.props.navigation.navigate("ChangePassword")
					  Alert.alert("Sukses", "Password sudah di ganti");
                        
                    }else{
                      
                      Alert.alert('Gagal','Silakan coba lagi!');
                    
                            }

        }).done();
		}
	}
	
  render() {
    return (
      <Container>
        <Content padder>
			<Form style={styles.formPassword}>
				<View>
					<DatePicker
						style={styles.period}
						showIcon={false}
						date={this.state.month}
						mode="date"
						androidMode="calendar"
						placeholder="Select Date"
						format="MMM-YY"
						confirmBtnText="Confirm"
						cancelBtnText="Cancel"
						onDateChange={(date) => {this.setState({month: date})}}
					/>
				</View>
			</Form>
            <Button block info style={styles.footerBottom} onPress={() => { this.props.navigation.navigate('Slip', { bulan: this.state.month });
          }}>
				<Text>Lihat Slip</Text>
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
Filter.navigationOptions = ({ navigation }) => ({
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
  st_inputfnt:{
      color: '#000',
  },
  formLogin : {
    marginTop :30,
    paddingLeft : 10,
    paddingRight : 30,
  },
  period:{
    marginTop: 16,
    paddingTop: 10,
    marginLeft: 16,
    marginRight: 16,
	width: DeviceWidth*0.85
  },
  footerBottom:{
    marginTop: 16,
    paddingTop: 10,
    marginLeft: 16,
    marginRight: 16,
	backgroundColor: '#0fa1d4',
	width: DeviceWidth*0.85
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