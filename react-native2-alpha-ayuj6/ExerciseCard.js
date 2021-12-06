import React from 'react';
import { Button, Card, Paragraph } from 'react-native-paper';
import { StyleSheet, View, Dimensions } from "react-native";
import ExerciseModal from './ExerciseModal';
import moment from "moment";

class ExerciseCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
        }
    }
    
    delete = () => {
        this.props.deleteExercise(this.props.id);
    }

    showModal = () => this.setState({ visible: true });
    hideModal = () => this.setState({ visible: false });
    
    getModal() {
        if (this.state.visible) {
            return (
                <ExerciseModal 
                    visible={this.state.visible} 
                    updateData={this.props.updateData} 
                    hideModal={this.hideModal}
                    id={this.props.id} 
                    date={this.props.date} 
                    accessToken={this.props.accessToken} 
                    name={this.props.name}
                    duration={this.props.duration} 
                    calories={this.props.calories} 
                />
            )
        }
    }

    render() {
        let currentDate = moment(this.props.date).format('MMMM Do YYYY, h:mm:ss a')
        return (
            <View>
                <Card style={styles.card} >
                    <Card.Title style={styles.header} title={this.props.name} />
                    <Card.Content>
                            <View style={styles.content}>
                                <Paragraph style={styles.cardPara}>{currentDate} </Paragraph>
                                <Paragraph style={styles.cardPara}>Duration: {this.props.duration} min</Paragraph>
                                <Paragraph style={styles.cardPara}>Calories Burnt: {this.props.calories} kcal</Paragraph>
                            </View>
                    </Card.Content>
                    {this.props.showButtons ? <Card.Actions>
                        <Button color="maroon" onPress={this.showModal}>Edit</Button>
                        <Button color="maroon" onPress={this.delete}>Delete</Button>
                        {this.getModal()}
                    </Card.Actions>
                        : <View></View>}
                </Card>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        margin: 5,
        borderRadius: 10,
        width: Dimensions.get('window').width *0.8,       
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    cardPara: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ExerciseCard;