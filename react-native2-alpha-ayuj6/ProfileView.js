import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

class ProfileView extends React.Component {
  constructor(props) {
    super(props);

    // Initialize states which will be used for TextInputs
    this.state = {
      firstName: "",
      lastName: "",
      goalDailyCalories: 0.0,
      goalDailyProtein: 0.0,
      goalDailyCarbohydrates: 0.0,
      goalDailyFat: 0.0,
      goalDailyActivity: 0.0,

      accessToken: "",
      username: "",
    }
  }

  async getStoredData(key) {
    try {
      let value = await AsyncStorage.getItem(key);
      this.setState({ [key]: value });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * On first load, fetch the user data from the `/users` endpoint.
   *
   */
  async componentDidMount() {
    await this.getStoredData("accessToken");
    await this.getStoredData("username");
    fetch('http://cs571.cs.wisc.edu:5000/users/' + this.state.username, {
      method: 'GET',
      headers: { 'x-access-token': this.state.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          firstName: res.firstName,
          lastName: res.lastName,
          goalDailyCalories: res.goalDailyCalories,
          goalDailyProtein: res.goalDailyProtein,
          goalDailyCarbohydrates: res.goalDailyCarbohydrates,
          goalDailyFat: res.goalDailyFat,
          goalDailyActivity: res.goalDailyActivity
        });
      });
  }

  /**
   * Handler for Save Profile button. Sends a PUT request to the `/users` endpoint.
   *
   */
  handleSaveProfile() {
    fetch("http://cs571.cs.wisc.edu:5000/users/" + this.state.username, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.state.accessToken,
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        goalDailyCalories: this.state.goalDailyCalories,
        goalDailyProtein: this.state.goalDailyProtein,
        goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
        goalDailyFat: this.state.goalDailyFat,
        goalDailyActivity: this.state.goalDailyActivity,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        alert("Your profile has been updated!");
      })
      .catch((err) => {
        alert(
          "Something went wrong! Verify you have filled out the fields correctly."
        );
      });
  }

  render() {
    return (
      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={{
          flexGrow: 11,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.space} />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <Icon
            name="male"
            size={40}
            color="#900"
            style={{ marginRight: 20 }}
          />
          <Text style={styles.bigText}>About Me</Text>
        </View>
        <View style={styles.spaceSmall}></View>
        <Text>Let's get to know you!</Text>
        <Text>Specify your information below.</Text>
        <View style={styles.space} />

        <Text
          style={{
            textAlignVertical: "center",
            fontWeight: "700",
            fontSize: 20,
          }}
        >
          Personal Information
        </Text>
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
            First Name
          </Text>
        </View>
        <TextInput
          accessible={true}  
          accessibilityLabel={"First Name"}
          accessibilityHint={"Edit your first name"}
        
          style={styles.input}
          underlineColorAndroid="transparent"
          //placeholder="Bucky"
          //placeholderTextColor="#d9bebd"
          onChangeText={(firstName) => this.setState({ firstName: firstName })}
          value={this.state.firstName}
          autoCapitalize="none"
        />
        <View style={styles.spaceSmall}></View>

        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
            Last Name
          </Text>
        </View>
        <TextInput
          accessible={true} 
          accessibilityLabel={"Last Name"}
          accessibilityHint={"Edit your last name"}
          
          style={styles.input}
          underlineColorAndroid="transparent"
          //placeholder="Badger"
          //placeholderTextColor="#d9bebd"
          onChangeText={(lastName) => this.setState({ lastName: lastName })}
          value={this.state.lastName}
          autoCapitalize="none"
        />
        <View style={styles.spaceSmall}></View>

        <Text
          style={{
            textAlignVertical: "center",
            fontWeight: "700",
            fontSize: 20,
          }}
        >
          Fitness Goals
        </Text>
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
            Daily Calories (kcal)
          </Text>
        </View>
        <TextInput
          accessible={true}
          accessibilityLabel={"Daily Calories Goal"}
          accessibilityHint={"Edit your daily calories goal"}
          
          style={styles.input}
          underlineColorAndroid="transparent"
          //placeholder="2200"
          //placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyCalories) =>
            this.setState({
              goalDailyCalories: !goalDailyCalories
                ? 0
                : parseFloat(goalDailyCalories),
            })
          }
          value={this.state.goalDailyCalories + ""}
          autoCapitalize="none"
        />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
            Daily Protein (grams)
          </Text>
        </View>
        <TextInput
          accessible={true}  
          accessibilityLabel={"Daily Protein Goal"}
          accessibilityHint={"Edit your daily protein goal"}
          
          
          style={styles.input}
          underlineColorAndroid="transparent"
          //placeholder="52"
          //placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyProtein) =>
            this.setState({
              goalDailyProtein: !goalDailyProtein
                ? 0
                : parseFloat(goalDailyProtein),
            })
          }
          value={this.state.goalDailyProtein + ""}
          autoCapitalize="none"
        />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
            Daily Carbs (grams)
          </Text>
        </View>
        <TextInput
          accessible={true} 
          accessibilityLabel={"Daily Carbohydrates Goal"}
          accessibilityHint={"Edit your daily carbohydrates goal"}
          
          style={styles.input}
          underlineColorAndroid="transparent"
          //placeholder="130"
          //placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyCarbohydrates) =>
            this.setState({
              goalDailyCarbohydrates: !goalDailyCarbohydrates
                ? 0
                : parseFloat(goalDailyCarbohydrates),
            })
          }
          value={this.state.goalDailyCarbohydrates + ""}
          autoCapitalize="none"
        />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
            Daily Fat (grams)
          </Text>
        </View>
        <TextInput
          accessible={true} 
          accessibilityLabel={"Daily Fat Goal"}
          accessibilityHint={"Edit your daily fat goal"}
          
          style={styles.input}
          underlineColorAndroid="transparent"
          //placeholder="35"
          //placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyFat) =>
            this.setState({
              goalDailyFat: !goalDailyFat ? 0 : parseFloat(goalDailyFat),
            })
          }
          value={this.state.goalDailyFat + ""}
          autoCapitalize="none"
        />
        <View style={styles.spaceSmall}></View>
        <View>
          <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
            Daily Activity (mins)
          </Text>
        </View>
        <TextInput
          accessible={true}  
          accessibilityLabel={"Daily Activity Goal"}
          accessibilityHint={"Edit your daily activity time goal"}
          
          style={styles.input}
          underlineColorAndroid="transparent"
          //placeholder="60"
          //placeholderTextColor="#d9bebd"
          onChangeText={(goalDailyActivity) =>
            this.setState({
              goalDailyActivity: !goalDailyActivity
                ? 0
                : parseFloat(goalDailyActivity),
            })
          }
          value={this.state.goalDailyActivity + ""}
          autoCapitalize="none"
        />
        <View style={styles.spaceSmall}></View>

        <View style={styles.space} />

        <Text style={{ fontWeight: "700", fontSize: 20 }}>
          Looks good! All set?
        </Text>
        <View style={styles.spaceSmall} />
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={"Save Profile"}
            accessibilityHint={"Double tap to save changes to your profile"}
            
            color="#942a21"
            style={styles.buttonInline}
            //title="Save Profile"
            onPress={() => this.handleSaveProfile()}
          >
            <Text style={styles.buttonInline}>Save Profile</Text>
            </TouchableOpacity>
          <View style={styles.spaceSmall} />
        </View>
        <View style={styles.space} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    height: Dimensions.get("window").height,
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5,
  },
  spaceSmall: {
    width: 20, // or whatever size you need
    height: 10,
  },
  space: {
    width: 20, // or whatever size you need
    height: 20,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20,
  },
  buttonInline: {
    display: "flex",
    backgroundColor: "maroon",
    padding: 5,
    color: "white",
    justifyContent: 'center',
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: "#c9392c",
    borderWidth: 1,
  },
  inputInline: {
    flexDirection: "row",
    display: "flex",
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: "#c9392c",
    borderWidth: 1,
  },
  bottomButtons: {
    flexDirection: "row",
    display: "flex",
    margin: 5,
  },
});

export default ProfileView;