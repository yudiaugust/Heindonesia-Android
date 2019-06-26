import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ListView,
  Image,
  TextInput,
  AppRegistry,
  Alert,
  ActivityIndicator,
  Dimensions,
  AsyncStorage
} from "react-native";
import { Container, Header, Left, Body, Title, Card, CardItem, Content, Right, Icon, Tab, Tabs, Button, Footer, Form, Item, Label, Thumbnail, FooterTab } from "native-base";

import { StackNavigator } from "react-navigation";
import firebase from "react-native-firebase";
import Loader from '../../indicator/loader';

import Chat from "./chat";
const DeviceWidth = Dimensions.get('window').width

var {height, width} = Dimensions.get('window');
var textFontSize = width * 0.03;

var name, uid, email;

export default class UserList extends Component {
  state = {
    name: "",
    uid: null,
    email: ""
  };
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loading: true,
	  avatar: "",
	  company: props.navigation.state.params.company
    };
    this.userRef = this.getRef().child("user");
  }

  getRef() {
    return firebase.database().ref();
  }

  listenForItems(userRef) {
    var user = firebase.auth().currentUser;
	//const company = this.state.company;
	//var filter = ref.orderByChild("user/company").equalTo(company);
    userRef.on("value", snap => {
      // get children as an array
      var items = [];
      snap.forEach(child => {
        if (child.val().company == 'Heindonesia')
          items.push({
            department: child.val().department,
            uid: child.val().uid,
            email: child.val().email
          });
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items),
      });
    });
  }

  componentDidMount() {
    this.listenForItems(this.userRef);
	
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
				loading: false
 
              })
              
            }).catch((error) => {
              console.error(error);
            });
	});
  }

  renderRow = rowData => {
    return (
        <Card>
            <CardItem>
			  <TouchableOpacity
				onPress={() => {
				  name = rowData.name;
				  email = rowData.email;
				  uid = rowData.uid;
				  this.props.navigation.navigate("Chat", {
					name: name,
					email: email,
					uid: uid
				  });
				}}
			  >
				<View style={styles.profileContainer}>
				  <Text style={styles.profileName}>{rowData.department}</Text>
				</View>
			  </TouchableOpacity>
            </CardItem>
        </Card>
    );
  };

  render() {
    return (
      <Container>
        <Content>
			<View style={styles.container}>
				<Card>
					<CardItem>
						<View style={styles.topGroup}>
						  <Text style={styles.user}>Select Department</Text>
						</View>
					</CardItem>
				</Card>
				<ListView
				  dataSource={this.state.dataSource}
				  renderRow={this.renderRow}
				/>
			   <Loader loading={this.state.loading} />
			</View>
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
UserList.navigationOptions = ({ navigation }) => ({
  header: (
    <Header style={styles.header}>
      <Left>
        <Button transparent onPress={() => navigation.goBack(null)}>
          <Icon name="ios-arrow-back" />
        </Button>
      </Left>
      <Body>
        <Title> Live Support</Title>
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
  container: {
    flex: 1,
    alignItems: "stretch",
    marginRight: 10,
    marginLeft: 10
  },
  header:{
	backgroundColor: '#0fa1d4',
  },
  rightButton: {
    marginTop: 10,
    marginLeft: 5,
    marginRight: 10,
    padding: 0
  },
  topGroup: {
    flexDirection: "row",
    margin: 10
  },
  user: {
    flex: 1,
    color: "#3A5BB1",
    //tintColor: "#fff",
    //secondaryColor: '#E9E9E9',
    //grayColor: '#A5A5A5',
    fontSize: 20,
    fontWeight: '400',
    padding: 5
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 6,
    marginBottom: 8
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 6
  },
  profileName: {
    marginLeft: 6,
    fontSize: 16
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
});
