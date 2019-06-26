'use strict';

import React, { Component } from 'react';

import { StyleSheet, View, AsyncStorage, Alert, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Item, Input, Form, Thumbnail, Label, Button, Text } from 'native-base';
import Loader from '../../indicator/loader';
import { StackActions, NavigationActions } from 'react-navigation';
import { Card, CardItem } from "native-base";
import DeviceInfo from 'react-native-device-info';
import {Actions} from 'react-native-router-flux';

class loginform extends Component {
    constructor(props) {
    super(props);
    this.state = {
	  device : '',
      username : '',
      password : '',
      success : '',
      loading: false
    }
  }
componentDidMount() {
   this.setState({device: DeviceInfo.getUniqueID()});
}
    handleClick(navigate){
      this.setState({
        loading: true
      });

      fetch('http://103.247.10.156/~heiteknologi/api/User_Login.php', {
       method: 'POST',
       headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
        // body : 
        body: JSON.stringify({
              username: this.state.username,
              password: this.state.password,
			  device: this.state.device,
             })
        })
        .then((response) => response.json())
        .then((responseJson) => {
                 this.setState({
                      loading: false
                  }, ()=>{

                    if(responseJson === 'Data Matched') {
                      console.log(responseJson);
                       AsyncStorage.setItem('username', this.state.username);
                           const resetAction = StackActions.reset({
                            index: 0,
                            actions: [
                             NavigationActions.navigate({ routeName: 'Home'})
                            ]
                          })
                        this.props.data.dispatch(resetAction)
                    }else{
                      
                      this.setState({ spinner: false });
                      setTimeout(() => {
                        Alert.alert('Warning','Anda tidak di ijinkan untuk login di device ini! silakan hubungi admin untuk meregister device');
                      }, 100);       
                    
                            }
                  }
                );
                 
                    
                

        }).done();
  }

  render() {
    const { navigate } = this.props.data;
    return (
      <Content style={styles.contentLogin}>
            <Loader loading={this.state.loading} />
            <View style={styles.center}>
                  <Thumbnail square large source={require('../../assets/images/icon.png')} style={styles.images}/>
                    
            </View>
          
          <Form style={styles.formLogin}>
            <Item floatingLabel>
              <Label>
                <Text style={styles.st_inputfnt}>Username</Text>
              </Label>
              <Input style={styles.st_inputfnt} onChangeText={(text) => this.setState({username:text})}/>
            </Item>
            <Item floatingLabel>
              <Label>
                <Text style={styles.st_inputfnt}>Password</Text>
              </Label>
              <Input style={styles.st_inputfnt} secureTextEntry={true} onChangeText={(text) => this.setState({password:text})}/>
            </Item>
          </Form>
		  <Card transparent>
			<CardItem>
				<Button style={styles.footerBottom} onPress={() => this.handleClick(navigate)}>
					<Text>Sign In</Text>
				</Button>
				<Button style={styles.footerBottom} onPress={() => navigate('SignUp')}>
					<Text>Sign Up</Text>
				</Button>
			</CardItem>
		  </Card>
        </Content>
    );
  }
}

const styles = StyleSheet.create({
  icon:{
    color: 'white',
  },
  footerBottom:{
	width: '45%',
    marginTop: 16,
    paddingTop: 10,
    marginLeft: 5,
    marginRight: 15,
	backgroundColor: '#0fa1d4',
	alignItems: 'center', 
    justifyContent: 'center',
  },
  formLogin : {
    marginTop :30,
    paddingLeft : 10,
    paddingRight : 30,
  },
  contentLogin : {
    marginTop : 10,
  },
  images:{
      marginTop: 80,
      width: 150,
      height: 150,
      borderRadius: 20,
  },
  font1:{
      fontSize: 20,
      color: 'black',
      fontWeight: 'bold',
    },
  center:{
      flex: 1,
        alignItems: 'center',
        justifyContent: 'center', 
  },
  st_inputfnt:{
      color: 'black',
  },
  footerBottomSignUp:{
      alignItems: 'center', 
      justifyContent: 'center',
    },
  st_signup:{
      color: 'black',
      fontWeight: '500', 
    }
});


export default loginform;