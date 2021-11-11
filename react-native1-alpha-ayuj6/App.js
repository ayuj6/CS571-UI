import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {AuthStackNavigator} from './AuthStackNavigator'

const RootStack = createNativeStackNavigator();

export default function() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{headerShown:false,}}>
          <RootStack.Screen name={'AuthStack'} component={AuthStackNavigator}/>
      </RootStack.Navigator>
    </NavigationContainer>
  );
}


