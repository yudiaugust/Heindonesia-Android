import React from "react";
import { StyleSheet, AppRegistry, Alert, Dimensions, AsyncStorage, View } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Form, Input, Item, Label, Footer, FooterTab, List, ListItem, Separator } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';
import moment from "moment";
import Numeral from "numeral";
import { TextInputMask } from 'react-native-masked-text'

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class Simulasi extends React.Component {
	
constructor(props) {
 super(props);
   this.state = {
	   deviceID: '',
	   employeeID: '',
	   persentase: '',
	   pengkalian: '',
	   gaji: '',
	   sisa: '',
	   hasil: '',
	   company: ''
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
              fetch('http://103.247.10.156/~heiteknologi/api/Check_Simulasi.php', {
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
 
                persentase : responseJson[0].persentase,
				pengkalian: responseJson[0].pengkalian
 
              })
            })
              
            }).catch((error) => {
              console.error(error);
            });
    });
  }
  
  totalTerima = () => {
	
	let hitung = null;
    
	hitung =  Number(this.state.gaji) * Number(this.state.pengkalian) - Number(this.state.sisa);
    totalHitung = Number(this.state.persentase) / Number(100) * Number(hitung)
    hitung = totalHitung.toString();
    this.setState({
      hasil: totalHitung
    });
	
  }

  render() {
	const simulasi = Numeral(this.state.hasil).format("0,000");
    return (
      <Container>
        <Content padder>
			<Form style={styles.formSimulasi}>
				<Card>
					<CardItem>
						<Icon active name="calculator" />
						<Text>Simulasi Pinjaman</Text>
					</CardItem>
					<CardItem bordered>
						<View>
							<Label>
							<Text style={styles.st_inputfnt}>Masukan Gaji Pokok</Text>
								</Label>
							<TextInputMask
								ref={ref => this.gapok = ref}
								type={'money'}
								options={{
									precision: 0,
									separator: ',',
									delimiter: '.',
									unit: '',
									suffixUnit: ''
								}}
								value={this.state.gaji}
								onChangeText={text => {
									this.setState({
										gaji: this.gapok.getRawValue()
									})
								}}
							/>
						</View>
					</CardItem>
					<CardItem bordered>
						<View>
							<Label>
								<Text style={styles.st_inputfnt}>Masukan Sisa Pinjaman</Text>
							</Label>
							<TextInputMask
								ref={ref => this.sisaPinjaman = ref}
								type={'money'}
								options={{
									precision: 0,
									separator: ',',
									delimiter: '.',
									unit: '',
									suffixUnit: ''
								}}
								value={this.state.sisa}
								onChangeText={text => {
									this.setState({
										sisa: this.sisaPinjaman.getRawValue()
									})
								}}
							/>
						</View>
					</CardItem>
					<CardItem bordered>
						<View>
							<Label>
								<Text style={styles.st_inputfnt}>Hasil</Text>
							</Label>
							<Text style={styles.st_inputfnt}>{Numeral(this.state.hasil).format("0,000")}</Text>
						</View>
					</CardItem>
				</Card>
			</Form>
            <Button block info style={styles.footerBottom} onPress={this.totalTerima.bind(this)}>
              <Text>Hitung</Text>
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
Simulasi.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Simulasi Pinjaman</Title>
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