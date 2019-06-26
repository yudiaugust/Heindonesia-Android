import React, { Component } from 'react';
import { StyleSheet, AppRegistry, Alert, View, ActivityIndicator, Image, Dimensions, AsyncStorage } from "react-native";
import { DatePicker, Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Picker, Label, Form, Item, Input, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class AddAbsence extends Component {
	
	constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
		employeeID: '',
		employeeName: '',
		absenceReason: undefined,
		absenceFrom: '',
		absenceTo: '',
		description: '',
		requestStatus: 'Pending',
		companyCode: '',
		IsPremium: 'Y',
		ReasonResult: {
             items: []
		}
	}
	this.setFrom = this.setFrom.bind(this);
	this.setTo = this.setTo.bind(this);
}

setReason(value: string) {
    this.setState({
      absenceReason: value
    });
  }
  
  setFrom(newDate) {
    this.setState({ absenceFrom: newDate });
  }
  
  setTo(newDate) {
    this.setState({ absenceTo: newDate });
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
 
                IsPremium : responseJson[0].IsPremium
 
              })
              
            })
              this.GetReason()
            }).catch((error) => {
              console.error(error);
            }).done();
	});
}

GetReason = () =>{  
fetch('http://103.247.10.156/~heiteknologi/api/Check_Absence.php')
         .then((response) => response.json())
         .then((responseJson) => {
           this.setState({
             ReasonResult: responseJson,
			 isLoading: false
           });
         })
         .catch((error) => {
           console.error(error);
         });
}

InsertDataToServer = () =>{

      fetch('http://103.247.10.156/~heiteknologi/api/Add_Absence.php', {
       method: 'POST',
       headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        // body : 
        body: JSON.stringify({
				employeeID: this.state.employeeID,
				employeeName: this.state.employeeName,
				absenceReason: this.state.absenceReason,
				absenceFrom: this.state.absenceFrom.toString().substr(4, 12),
				absenceTo: this.state.absenceTo.toString().substr(4, 12),
				description: this.state.description,
				requestStatus: this.state.requestStatus,
				company: this.state.companyCode,
             })
        })
        .then((response) => response.json())
        .then((responseJson) => {
                 if(responseJson === 'Success') {
					  this.props.navigation.navigate("Absence")
					  Alert.alert("Sukses", "Request Absence berhasil");
                        
                    }else{
                      
                      Alert.alert('Request Absence  gagal','Silakan coba lagi!');
                    
                            }

        }).done();
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
          <Form>
			<Card transparent style={{width: "98%"}}>
				<CardItem>
					<Icon active name="ios-create" />
					<Text>Please fill out this form</Text>
				</CardItem>
				<CardItem bordered>
					<View>
						<Label>
							Reason :
						</Label>
						<Picker
							note
							mode="dropdown"
							style={{ width: 500 }}
							selectedValue={this.state.absenceReason}
							onValueChange={this.setReason.bind(this)}
						>
							{ this.state.ReasonResult.map((items, key)=>(
							<Picker.Item label={items.reason} value={items.reason} key={key} />)
							)}
						</Picker>
					</View>
				</CardItem>
				<CardItem bordered>
					<View>
						<Label>
							Absence Date :
						</Label>
						<Label>
							From :
						</Label>
						<DatePicker
							defaultDate={new Date}
							minimumDate={new Date(2019, 1, 1)}
							maximumDate={new Date(2019, 12, 31)}
							locale={"id"}
							timeZoneOffsetInMinutes={undefined}
							modalTransparent={false}
							animationType={"fade"}
							androidMode={"calendar"}
							placeHolderText="Select date"
							textStyle={{ color: "green" }}
							placeHolderTextStyle={{ color: "#d3d3d3" }}
							onDateChange={this.setFrom}
							disabled={false}
						/>
						<Label>
							To :
						</Label>
						<DatePicker
							defaultDate={new Date}
							minimumDate={new Date(2019, 1, 1)}
							maximumDate={new Date(2019, 12, 31)}
							locale={"id"}
							timeZoneOffsetInMinutes={undefined}
							modalTransparent={false}
							animationType={"fade"}
							androidMode={"calendar"}
							placeHolderText="Select date"
							textStyle={{ color: "green" }}
							placeHolderTextStyle={{ color: "#d3d3d3" }}
							onDateChange={this.setTo}
							disabled={false}
						/>
					</View>
				</CardItem>
				<CardItem bordered>
					<View>
						<Label>
							Description :
						</Label>
						<Input style={styles.st_inputfnt} secureTextEntry={false} onChangeText={(text) => this.setState({description:text})}/>
					</View>
				</CardItem>
			</Card>
          </Form>
            <Button block info style={styles.footerBottom} onPress={this.InsertDataToServer}>
              <Text>Submit</Text>
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

AddAbsence.navigationOptions = ({ navigation }) => ({
  header: (
    <Header hasTabs style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Add Absence</Title>
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
  footerBottom:{
    marginTop: 16,
    paddingTop: 10,
    marginLeft: 16,
    marginRight: 16,
	backgroundColor: '#0fa1d4',
  },
  st_inputfnt:{
      color: '#000',
  },
  footer: {
    backgroundColor: '#fff',
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