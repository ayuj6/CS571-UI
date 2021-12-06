import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, Dimensions, Modal, } from 'react-native';
import TimePicker from './TimePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

class AddExercise extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      duration: 0.0,
      date: (new Date()).toISOString(),
      calories: 0.0,
      id: '',
      accessToken: '',
      modalVisible: this.props.visible,
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

  handleAddExercise() {
    this.setState({
      duration: parseFloat(this.state.duration),
      calories: parseFloat(this.state.calories),
    }, () => fetch('http://cs571.cs.wisc.edu:5000/activities/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': this.props.accessToken
      },
      body: JSON.stringify({
        name: this.state.name,
        duration: this.state.duration,
        date: moment(this.state.date).format(),
        calories: this.state.calories,
      })
    })
      .then(res => res.json())
      .then(res => {
        this.props.updateData();
        this.props.hideModal()
      })
      .catch(err => {
        alert("Unable to add exercise, please check all fields!");
      }));
  }


  getDateTime(date) {
    this.setState({
      date: date
    })
  }

  render() {
    return (
      <Modal visible={this.props.visible} transparent={true}>
          <View style={styles.modalView}>
            <Text style={styles.bigText}>Exercise Details</Text>
            <View style={styles.space} />
            <View>
              <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Name</Text>
            </View>
            <TextInput 
              style={styles.input}
              onChangeText={(name) => this.setState({ name: name })}
              defaultValue={this.state.name}
              autoCapitalize="none" />
            <View style={styles.spaceSmall}/>

            <View>
              <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Duration (minutes)</Text>
            </View>
            <TextInput 
              style={styles.input}
              onChangeText={(duration) => this.setState({ duration: duration })}
              defaultValue={this.state.duration + ""}
              autoCapitalize="none" />
            <View style={styles.spaceSmall}/>
            <View>
              <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Calories Burnt (cal)</Text>
            </View>
            <TextInput 
              style={styles.input}
              onChangeText={(calories) => this.setState({ calories: calories })}
              defaultValue={this.state.calories + ""}
              autoCapitalize="none" />

            <View style={styles.space} />
            <View>
              <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>Exercise Date and Time</Text>
            </View>
            <View style={styles.spaceSmall}/>
            <TimePicker date={this.state.date} getDateTime={(date) => this.getDateTime(date)} />

            <View style={styles.space} />
            <View>
              <Text style={{ textAlignVertical: "center", fontWeight: "400" }}>Looks good! Ready to save your work?</Text>
            </View>

            <View style={styles.space} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Button color="maroon" style={styles.buttonInline} title="SAVE EXERCISE" onPress={() => this.handleAddExercise()} />
              <View style={styles.spaceHorizontal} />
              <Button color="maroon" style={styles.buttonInline} title="NEVER MIND" onPress={() => this.props.hideModal()} />
            </View>
          </View>
      </Modal>);
  }
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.20,
    shadowRadius: 3.80,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  bigText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5
  },
  spaceSmall: {
    width: 20,
    height: 10,
  },
  space: {
    width: 20,
    height: 20,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20
  },
  buttonInline: {
    display: "flex"
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: '#c9392c',
    borderWidth: 1
  },
});

export default AddExercise;
