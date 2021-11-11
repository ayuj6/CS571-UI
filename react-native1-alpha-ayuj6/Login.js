import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import base64 from 'base-64';

export function Login({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  var token;

  async function onlogin() {
    try {
      await fetch('http://cs571.cs.wisc.edu:5000/login', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + base64.encode(username + ":" + password)
        }
      })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          token = res.token;
        }
        else {
          alert("Incorrect username or password! Please try again.");
          return null;
        }
      });
      if (token) {
        await fetch('http://cs571.cs.wisc.edu:5000/users/' + username, {
          method: 'GET',
          headers: {
            'x-access-token': token
          }
        })
        .then(res => res.json()).then(res2 => {
          navigation.navigate('Profile', { tokens: token, username: username, firstName: res2.firstName, lastName: res2.lastName, carbs: res2.goalDailyCarbohydrates, protein: res2.goalDailyProtein, calories: res2.goalDailyCalories, fat: res2.goalDailyFat, activity: res2.goalDailyActivity });
          });
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Fitness Tracker</Text>
      <Text>Welcome! Please login or signup to continue.</Text>
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
        title={'Login'}
        color="maroon"
        onPress={() => { onlogin(); }}
      />  
      <Button
        title={'Signup'}
        color="maroon"
        onPress={() => {
          navigation.navigate('Registration');
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
    marginTop: 10,
    width: 200,   
  },
  password: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    width: 200,
    marginBottom: 10,
  }
});
