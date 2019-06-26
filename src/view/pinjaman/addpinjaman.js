import React from "react";
import { StyleSheet, AppRegistry, Alert, AsyncStorage, Dimensions, View } from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Picker, Label, Form, Item, Input, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';
import { TextInputMask } from 'react-native-masked-text'

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class AddPinjaman extends React.Component {
	
	constructor(props) {
 super(props);
   this.state = {
		employeeID: '',
		employeeName: '',
		nominal: '',
		tgl_peminjaman: '',
		deskripsi: '',
		status: 'Pending',
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
 
                employeeID : responseJson[0].employeeID,
				employeeName : responseJson[0].name,
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
            }).catch((error) => {
              console.error(error);
            }).done();
	});
}

InsertDataToServer = () =>{

      fetch('http://103.247.10.156/~heiteknologi/api/Add_Pinjaman.php', {
       method: 'POST',
       headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        // body : 
        body: JSON.stringify({
				employeeID: this.state.employeeID,
				employeeName: this.state.employeeName,
				nominal: this.state.nominal,
				tgl_peminjaman: this.state.tgl_peminjaman,
				deskripsi: this.state.deskripsi,
				status: this.state.status,
				company: this.state.companyCode,
             })
        })
        .then((response) => response.json())
        .then((responseJson) => {
                 if(responseJson === 'Success') {
                      console.log(responseJson);
					  this.props.navigation.navigate("Pinjaman")
					  Alert.alert("Sukses", "Request Pinjaman berhasil");
                        
                    }else{
                      
                      Alert.alert('Request Pinjaman  gagal','Silakan coba lagi!');
                    
                            }

        }).done();
  }
  
  render() {
    return (
      <Container>
        <Content padder>
			<Form>
				<Card transparent style={{width: "98%"}}>
					<CardItem>
						<Icon active name="ios-create" />
						<Text>Please fill out this form</Text>
					</CardItem>
					<CardItem bordered>
						<View>
							<Label>
								Amount :
							</Label>
							<TextInputMask
								ref={ref => this.amountRef = ref}
								type={'money'}
								options={{
									precision: 0,
									separator: ',',
									delimiter: '.',
									unit: '',
									suffixUnit: ''
								}}
								value={this.state.nominal}
								onChangeText={text => {
									this.setState({
										nominal: this.amountRef.getRawValue()
									})
								}}
							/>
						</View>
					</CardItem>
					<CardItem bordered>
						<View>
							<Label>
								Keterangan
							</Label>
							<Input style={styles.st_inputfnt} secureTextEntry={false} onChangeText={(text) => this.setState({deskripsi:text})}/>
						</View>
					</CardItem>
				</Card>
			</Form>
            <Button block info style={styles.footerBottom} onPress={this.InsertDataToServer}>
              <Text>Ajukan</Text>
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

AddPinjaman.navigationOptions = ({ navigation }) => ({
  header: (
    <Header hasTabs style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Pengajuan Pinjaman</Title>
      </Body>
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
  contentAttendance : {
    marginTop : 10,
  },
  footerBottom:{
    marginTop: 16,
    paddingTop: 10,
    marginLeft: 16,
    marginRight: 16,
	backgroundColor: '#0fa1d4',
  },
  formCheckIn : {
    marginTop :30,
    paddingLeft : 10,
    paddingRight : 30,
  },
  st_inputfnt:{
      color: '#000',
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