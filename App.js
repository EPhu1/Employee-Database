import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { reducer } from './reducers/reducer'

import Home from './src/screens/Home';
import CreateEmployee from './src/screens/CreateEmployee';
import Profile from './src/screens/Profile';

const store = createStore(reducer)

const Stack = createStackNavigator();
const myOptions = {
  title: 'Home',
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: '#006aff'
  }
}

function App() {
    return (
      <Provider store = {store}>
        <View style={styles.container}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen 
                name = 'Home' 
                component = {Home}
                options = {myOptions}
              />
              <Stack.Screen 
                name = 'Create' 
                component = {CreateEmployee}
                options = {{...myOptions, title: 'Create Employee'}}
              />
              <Stack.Screen 
                name = 'Profile' 
                component = {Profile}
                options = {{...myOptions, title: 'Profile'}}
              />
            </Stack.Navigator>
        </NavigationContainer>
          {/* <Button title = 'submit data' onPress = {() =>{
            submitData()
          }}/> */}
        </View>
      </Provider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
    // marginTop: Constants.statusBarHeight
  },
});

export default App;