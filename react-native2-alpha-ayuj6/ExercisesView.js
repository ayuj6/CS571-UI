import React from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import ExerciseCard from './ExerciseCard';
import AddExercise from './AddExercise';

class ExercisesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      duration: 0.0,
      date: "",
      calories: 0.0,
      activityArray: [],
      accessToken: "",
      username: "",
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

  deleteExercise(id) {
    fetch('http://cs571.cs.wisc.edu:5000/activities/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.state.accessToken
      },
    })
      .then(res => res.json())
      .then(res => {
        this.updateData();
        alert("Exercise deleted!");
      })
      .catch(err => {
        alert("Unable to delete! ");
      });
  }

  hideModal = () => this.setState({ visible: false });
  handleAddActivity() {
    this.setState({ visible: true });
  }

  getModal() {
    if (this.state.visible) {
      return (
        <AddExercise
          visible={this.state.visible}
          updateData={() => this.updateData()}
          hideModal={this.hideModal}
          accessToken={this.state.accessToken} 
        />
      )
    }
  }

  updateData() {
    fetch('http://cs571.cs.wisc.edu:5000/activities/', {
      method: 'GET',
      headers: {
        'x-access-token': this.state.accessToken
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ activityArray: res.activities });
        this.getExercises();
      })
      .catch(err => { console.log(err) });
  }

  getExercises() {
    let cardList = [];
    for (let i = 0; i < this.state.activityArray.length; i++) {
      let value = this.state.activityArray[i];
      cardList.push(
        <ExerciseCard
          key={i}
          name={value.name}
          date={value.date}
          duration={value.duration}
          calories={value.calories}
          id={value.id}
          accessToken={this.state.accessToken}
          deleteExercise={(id) => this.deleteExercise(id)}
          updateData={() => this.updateData()}
          showButtons={true} 
          />)
    }
    return cardList;
  }


  async componentDidMount() {
    await this.getVal("accessToken");
    await this.getVal("username");
    this.updateData();
    this.navListener = this.props.navigation.addListener('focus', () => {
      this.updateData();
    });
  }

  componentWillUnmount() {
    this.navListener();
  }

  render() {
    return (
      <ScrollView style={styles.mainContainer} contentContainerStyle={{ flexGrow: 11, justifyContent: 'center', alignItems: "center" }}>
        <View style={styles.space} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Icon name="walking" size={40} color="#900" style={{ marginRight: 20 }} />
          <Text style={styles.header}>Exercises</Text>
        </View>
        <View style={styles.spaceSmall}/>
        <Text>Let's get to work!</Text>
        <Text>Record your exercises below.</Text>
        <View style={styles.spaceSmall}/>
        {this.getModal()}
        <View>{this.getExercises()}</View>
        <View style={styles.space} />

        <Button
          title="Add Exercise"
          color="maroon"
          onPress={() => this.handleAddActivity()}
        />
      </ScrollView>)
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
  },
  spaceSmall: {
    width: 20,
    height: 10,
  },
  space: {
    width: 20,
    height: 20,
  },
});

export default ExercisesView;
