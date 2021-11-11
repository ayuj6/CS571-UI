import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

export function Profile({route, navigation}) {
    const [firstName, setFirstName] = React.useState(route.params.firstName);
    const [lastName, setLastName] = React.useState(route.params.lastName);
    const [calories, setCalories] = React.useState(route.params.calories + "");
    const [protein, setProtein] = React.useState(route.params.protein + "");
    const [carbs, setCarbs] = React.useState(route.params.carbs + "");
    const [fat, setFat] = React.useState(route.params.fat+ "");
    const [activity, setActivity] = React.useState(route.params.activity+"");

    var userName = (route.params.username);
    var token = (route.params.tokens);
 
    async function saveVal(){
        await fetch('http://cs571.cs.wisc.edu:5000/users/' + userName, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({
                "firstName": firstName,
                "lastName": lastName,
                "goalDailyCalories": calories,
                "goalDailyProtein": protein,
                "goalDailyCarbohydrates": carbs,
                "goalDailyFat": fat,
                "goalDailyActivity": activity
            })
        });
        alert("Your profile has been updated!")
    }

  return (
    
    <View style={styles.container}>
        <Text style={styles.head}>About Me</Text>
        <Text>Let's get to know you!</Text>
        <Text>Specify your information below.</Text>
        <Text style={styles.info}>Personal Information</Text>   
        <Text style={styles.field}>First Name</Text>
        <TextInput
            style={styles.inp}
            placeholder={firstName}
            value={firstName}
            onChangeText={(firstName) => setFirstName(firstName)}
        />
        <Text style={styles.field}>Last Name</Text>
        <TextInput
            style={styles.inp}
            placeholder={lastName}
            value={lastName}
            onChangeText={(lastName) => setLastName(lastName)}
        />
        <Text style={styles.fit}>Fitness Goals</Text>
        <Text style={styles.field}>Daily Calories (kcal)</Text>
        <TextInput
            style={styles.inp}
            value={calories}
            onChangeText={text => setCalories(text)}
        /> 
        <Text style={styles.field}>Daily Protein (grams)</Text>
        <TextInput
            onChangeText={text => setProtein(text)}
            value={protein}
            style={styles.inp}
        />
        <Text style={styles.field}>Daily Carbs (grams)</Text>
        <TextInput
            onChangeText={text => setCarbs(text)}
            value={carbs}
            style={styles.inp}
        />
        <Text style={styles.field}>Daily Fat (grams)</Text>
        <TextInput
            onChangeText={text => setFat(text)}
            value={fat}
            style={styles.inp}
        />      
        <Text style={styles.field}>Daily Activity (mins)</Text>
        <TextInput
            onChangeText={text => setActivity(text)}
            value={activity}
            style={styles.inp}
        />
        <Text style={styles.end}>Looks good! All set?</Text>
        <Button
            title={'Save Profile'}
            color="maroon"
            onPress={() => saveVal()}
        />
        <Button
            title={'Exit'}
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
    head:{
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    info:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
    },
    field:{
        fontSize: 12,
        fontWeight: 'bold',
    },
    inp:{
        borderWidth: 1,
        marginBottom: 10,
        borderColor: "red",
        padding: 10,
        width: 100,
    },
    fit:{
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    end:{
        marginBottom: 10,
        marginTop: 15,
        fontSize: 18,
        fontWeight: 'bold',
    },
  });