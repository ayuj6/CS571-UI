import React from 'react';

import LoginView from './LoginView';
import SignupView from './SignupView';
import ProfileView from './ProfileView';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import TodayView from './TodayView';
import ExercisesView from './ExercisesView';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, View } from 'react-native';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: undefined,
      username: undefined,
      activityArray: []
    }

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);
    this.SignoutButton = this.SignoutButton.bind(this);
  }

  /**
   * A callback function to store username and accessToken in the state
   * This callback function is passed to `LoginView`
   *
   * @param {string} username
   * @param {string} accessToken
   */
  login(username, accessToken) {
    this.setState({
      username: username,
      accessToken: accessToken
    });
  }

  /**
   * Revokes the access token, effectively signing a user out of their session.
   * 
   */
  revokeAccessToken() {
    this.setState({
      accessToken: undefined
    });
  }

  SignoutButton = () => {
    return <>
      <View style={{ flexDirection: 'row', marginRight: 10 }}>
        <TouchableOpacity
          onPress={() => this.setState({
            accessToken: undefined
          })}>
          <Ionicons name='ios-log-out' size={30} color='black' />
        </TouchableOpacity>
      </View>
    </>
  }

  /**
   * Defines a stack navigator for three screens, LoginView, SignupView, and ProfileView.
   *
   * We define the navigator to show only LoginView and SignupView if user is not logged in ('this.state.accessToken' does not exist)
   * and show ProfileView if the user is logged in (this.state.accessToken exists)
   *
   * See https://reactnavigation.org/docs/auth-flow/ for more details on the authentication flow.
   *
   * @returns `NavigationContainer`
   */
  render() {
    let AuthStack = createNativeStackNavigator();

    return (
      <NavigationContainer>
        <AuthStack.Navigator>
          {!this.state.accessToken ? (
            <>
              <AuthStack.Screen
                name="SignIn"
                options={{
                  title: 'Fitness Tracker Welcome',
                }}
              >
                {(props) => <LoginView {...props} login={this.login} />}
              </AuthStack.Screen>

              <AuthStack.Screen
                name="SignUp"
                options={{
                  title: 'Fitness Tracker Signup',
                }}
              >
                {(props) => <SignupView {...props} />}
              </AuthStack.Screen>
            </>
          ) : (
            <>
              <AuthStack.Screen name="FitnessTracker" options={{
                headerRight: this.SignoutButton
              }}>
                {(props) => <CreateBottomTabNav />}
              </AuthStack.Screen>
            </>
          )}
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}

const bottomTabNav = createBottomTabNavigator();
function CreateBottomTabNav() {
  return (
    <bottomTabNav.Navigator
      screenOptions={{
        activeTintColor: 'red',
      }}
      >
      <bottomTabNav.Screen
        name="Today"
        component={TodayView}
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ tintColor }) => {
            let iconName = 'md-cog';
            return <Ionicons name={iconName} size={25} color={tintColor} />;
          },
          screenOptions: {
            activeTintColor: 'red',
            inactiveTintColor: 'gray',
          },
        }}
      />
      <bottomTabNav.Screen
        name="Exercises"
        component={ExercisesView}
        focusable={true}
        options={{
          tabBarLabel: 'Exercises',
          tabBarIcon: ({ tintColor }) => {
            let iconName = 'md-walk';
            return <Ionicons name={iconName} size={25} color={tintColor} />;
          },
          screenOptions: {
            activeTintColor: 'red',
          },
        }}
      />
      <bottomTabNav.Screen
        name="Profile"
        component={ProfileView}

        options={{
          tabBarLabel: 'Profile',
          tabBarAccessibilityLabel: "Double tap to go to your profile page",
          
          tabBarIcon: ({ tintColor }) => {
            let iconName = 'md-person';
            return <>
               <Ionicons name={iconName} size={25} color={tintColor}/>
            </>
          },
          screenOptions: {
            activeTintColor: 'red',
          },
        }}
      />
    </bottomTabNav.Navigator>
  );
}

export default App;
