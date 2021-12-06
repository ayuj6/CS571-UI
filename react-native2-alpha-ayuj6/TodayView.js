import React from 'react';
import moment from "moment";
import { Headline } from 'react-native-paper';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome5';
import ExerciseCard from './ExerciseCard';

class TodayView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayExercises: [],
      currentDate: new Date(),
      dailyDuration: 0.0,
      dailyCalories: 0.0,
      dailyProtein: 0.0,
      dailyCarbo: 0.0,
      dailyActivity: 0,
      dailyFats: 0.0,
      dailyFoodCal: 0.0,
      goalDailyActivity: 0.0,
      username: '',
      accessToken: '',
      activityArray: '',
      visible: false,
    }
  }

  async getVal(key) {
    try {
      let value = await AsyncStorage.getItem(key);
      this.setState({ [key]: value });
    } catch (error) {
      console.log(error);
    }
  }

  getExercises() {
    let todayDuration = 0;
    let todayCalories = 0;
    fetch('http://cs571.cs.wisc.edu:5000/activities/', {
      method: 'GET',
      headers: { 'x-access-token': this.state.accessToken }
    })
      .then(res => res.json())
      .then(res => {

        this.setState({ todayExercises: [] });
        this.setState({ dailyDuration: todayDuration })
        this.setState({ dailyCalories: todayCalories })
        if (res.activities !== null && (typeof res.activities !== 'undefined')) {
          for (const activity of res.activities.values()) {
            if (moment(activity.date).format("MMM Do YY") === moment(this.state.currentDate).format("MMM Do YY")) {
              this.setState(previous => ({
                todayExercises: [...previous.todayExercises, activity]
              }));
              todayDuration += activity.duration;
              todayCalories += activity.calories;
              this.setState({ dailyDuration: todayDuration })
              this.setState({ dailyCalories: todayCalories })
            }
          }
        }
      });
  }

  displayExercises() {
    let cardList = [];
    for (let i = 0; i < this.state.todayExercises.length; i++) {
      let value = this.state.todayExercises[i];
      cardList.push(
      <ExerciseCard 
        key={i} 
        name={value.name} 
        date={value.date}
        duration={value.duration} 
        calories={value.calories}
        id={value.id} 
        accessToken={this.state.accessToken}
        showButtons={false} 
      />)
    }
    return cardList;
  }

  getValues() {
    fetch('http://cs571.cs.wisc.edu:5000/users/' + this.state.username, {
      method: 'GET',
      headers: { 'x-access-token': this.state.accessToken }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          goalDailyActivity: res.goalDailyActivity
        });
        this.setState({
          goalDailyActivity: parseFloat(this.state.goalDailyActivity)
        })
      });
  }

  async componentDidMount() {
    await this.getVal("accessToken");
    await this.getVal("username");
    this.getExercises();
    this.getValues();

    this.navListener = this.props.navigation.addListener('focus', () => {
      this.getExercises();
    });
  }

  componentWillUnmount() {
    this.navListener();
  }

  render() {
    return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }} >
        <View style={styles.space} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Icon name="cog" size={40} color="#900" style={{ marginRight: 20 }} />
          <Text style={styles.header}>Today</Text>
        </View>
        <View style={styles.spaceSmall} />
        <Text>What's on the agenda for today?</Text>
        <Text>Below are all of your goals and exercises</Text>

        <View style={styles.space} />
        <View style={styles.space} />

          <View style={styles.modalView}>
            <Headline>Goals Status</Headline>
            <View style={styles.spaceSmall} /> 
            <Text>Daily Activity: {this.state.dailyDuration}/{this.state.goalDailyActivity} minutes</Text>
          </View>

        <View style={styles.space} />
        <View style={styles.space} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Icon name="walking" size={20} color="#900" style={{ marginRight: 10 }} />
          <Text style={{ fontWeight: '700', fontSize: 20 }}> Exercises</Text>
          <View style={styles.spaceSmall} />

        </View>
        {this.displayExercises()}

        <View style={styles.space} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  spaceSmall: {
    width: 20,
    height: 10,
  },
  space: {
    width: 20,
    height: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
  },
  modalView: {
    backgroundColor: "white",
    padding: 30,
    alignItems: "center",
    shadowOpacity: 0.20,
    shadowRadius: 3.80,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TodayView;