import React from "react";
import { AppRegistry, Image, ImageBackground, StatusBar } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";
const routes = [
{ name: 'Home', text: 'Home' },
{ name: 'Profile', text: 'Profile' },
{ name: 'Company', text: 'Company' },
{ name: 'Simulasi', text: 'Simulasi' },
{ name: 'History', text: 'History' },
{ name: 'Absence', text: 'Absence' },
{ name: 'Claim', text: 'Claim' },
{ name: 'Location', text: 'Location' },
{ name: 'ChangePassword', text: 'Change Password' }
];
export default class SideBar extends React.Component {
  render() {
    return (
      <Container>
        <Content>
          <ImageBackground
            source={require('../assets/images/Bg.jpg')}
            style={{
              height: 120,
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <Image
              square
              style={{ height: 80, width: 70 }}
              source={require('../assets/images/icon.png')}
            />
          </ImageBackground>
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  onPress={() => this.props.navigation.navigate(data.name)}>
                  <Text>{data.text}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}
