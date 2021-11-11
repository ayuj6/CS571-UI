import React from 'react';
import {Login} from './Login';
import {Signup} from './Signup'
import {Profile} from './Profile'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

const AuthStack = createNativeStackNavigator();
 
export function AuthStackNavigator() {
  return (
      <AuthStack.Navigator screenOptions={{headerShown:false,}}>
          <AuthStack.Screen name={'Login'} component={Login}/>
          <AuthStack.Screen name={'Registration'} component={Signup}/>
          <AuthStack.Screen name={'Profile'} component={Profile}/>
      </AuthStack.Navigator>
  );
}


