import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export function Signup({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
 
  async function onsignup() {
    await fetch('http://cs571.cs.wisc.edu:5000/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": username,
        "password": password,
        "firstName": "",
        "lastName": "",
        "goalDailyCalories": 0,
        "goalDailyProtein": 0,
        "goalDailyCarbohydrates": 0,
        "goalDailyFat": 0,
        "goalDailyActivity": 0
      })
    }).then(res => {
      if (res.status === 400) {
        alert("Password length must be at least 5 characters");
      }
      else if (res.status === 409) {
        alert("Username already exists");
      }
      else {
        navigation.navigate('Login');
        alert("User created");
      }
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Fitness Tracker</Text>
      <Text>New here? Let's get started!</Text>
      <Text>Please create an account below</Text>
      <TextInput
        value={username}
        style={styles.username}
        onChangeText={(username) => setUsername(username)}
        placeholder={'Username'}
      />
      <TextInput
        style={styles.password}
        value={password}
        onChangeText={(password) => setPassword(password)}
        placeholder={'Password'}
        secureTextEntry={true}
      />
      <Button
        title={'Create Account'}
        color="maroon"
        onPress={() => { onsignup() }}
      />
      <Button
        title={'Nevermind'}
        color="maroon"
        onPress={() => {
          navigation.navigate('Login')
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  username: {
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "red",
    padding: 10,
    width: 200,
    marginTop: 10,
  },
  password: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    width: 200,
    marginBottom: 10,
  },
});
