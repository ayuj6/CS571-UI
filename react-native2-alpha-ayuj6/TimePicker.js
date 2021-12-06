import React, { useState, useEffect } from 'react';
import { View, Button, Platform, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

const TimePicker = (props) => {
  const [date, setDate] = useState('');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(
    () => {
      setDate(props.date);
    },
    [props.date],
  );

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    props.getDateTime(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Text>{moment(date).format("MMM Do YY")}</Text>
        <View style={styles.spaceHorizontal} />
        <Text>{moment(date).format('h:mm:ss a')}</Text>
      </View>
      <View style={styles.spaceSmall}></View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Button color="maroon" style={styles.buttonInline} onPress={showDatepicker} title="SET DATE" />
        <View style={styles.spaceHorizontal} />
        <Button color="maroon" style={styles.buttonInline} onPress={showTimepicker} title="SET TIME" />
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonInline: {
    display: "flex"
  },
  spaceSmall: {
    width: 20,
    height: 10,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20
  },
});

export default TimePicker;