import React from "react";
import { StyleSheet, AppRegistry, Alert, ActivityIndicator, Image, AsyncStorage, Dimensions, View } from "react-native";
import { DatePicker, Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Button, Text, Picker, Label, Form, Item, Input, Footer, FooterTab } from "native-base";
import { StackNavigator } from "react-navigation";
import DeviceInfo from 'react-native-device-info';
import { TextInputMask } from 'react-native-masked-text'

const DeviceWidth = Dimensions.get('window').width

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.02;

export default class AddClaim extends React.Component {
	
	constructor(props) {
 super(props);
   this.state = {
	   isLoading: true,
		employeeID: '',
		employeeName: '',
		claimType: undefined,
		claimAmount: '',
		claimDate: '',
		description: '',
		requestStatus: 'Pending',
		companyCode: '',
		IsPremium: 'Y',
		TipeResult: {
             items: []
		}
	   }
	this.setClaimdate = this.setClaimdate.bind(this);	   
}

setType(value: string) {
    this.setState({
      claimType: value
    });
  }
  
setClaimdate(newDate) {
    this.setState({ claimDate: newDate });
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
			this.GetTipe()
            }).catch((error) => {
              console.error(error);
            }).done();
	});
}

GetTipe = () =>{  
fetch('http://103.247.10.156/~heiteknologi/api/Check_Claim.php')
         .then((response) => response.json())
         .then((responseJson) => {
           this.setState({
             TipeResult: responseJson,
			 isLoading: false
           });
         })
         .catch((error) => {
           console.error(error);
         });
}

InsertDataToServer = () =>{

      fetch('http://103.247.10.156/~heiteknologi/api/Add_Claim.php', {
       method: 'POST',
       headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        // body : 
        body: JSON.stringify({
				employeeID: this.state.employeeID,
				employeeName: this.state.employeeName,
				claimType: this.state.claimType,
				claimDate: this.state.claimDate.toString().substr(4, 12),
				claimAmount: this.state.claimAmount,
				description: this.state.description,
				requestStatus: this.state.requestStatus,
				company: this.state.companyCode,
             })
        })
        .then((response) => response.json())
        .then((responseJson) => {
                 if(responseJson === 'Success') {
                      console.log(responseJson);
					  this.props.navigation.navigate("Claim")
					  Alert.alert("Sukses", "Request Claim berhasil");
                        
                    }else{
                      
                      Alert.alert('Request Claim  gagal','Silakan coba lagi!');
                    
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
								Claim Type:
							</Label>
							<Picker
								note
								mode="dropdown"
								style={{ width: 500 }}
								selectedValue={this.state.claimType}
								onValueChange={this.setType.bind(this)}
							>
								{ this.state.TipeResult.map((items, key)=>(
								<Picker.Item label={items.type} value={items.type} key={key} />)
								)}
							</Picker>
						</View>
					</CardItem>
					<CardItem bordered>
						<View>
							<Label>
								Claim Date :
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
								onDateChange={this.setClaimdate}
								disabled={false}
							/>
						</View>
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
								value={this.state.claimAmount}
								onChangeText={text => {
									this.setState({
										claimAmount: this.amountRef.getRawValue()
									})
								}}
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
              <Text>Claim</Text>
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

AddClaim.navigationOptions = ({ navigation }) => ({
  header: (
    <Header hasTabs style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title>Add Claim</Title>
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