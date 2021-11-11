import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Completed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      courseRating: "No Rating",
    }
    this.rating = React.createRef();
  }

  render() {
    return (
      <Card style={{ width: "33%", marginTop: "5px", marginBottom: "5px" }}>
      <Card.Body>
        <Card.Title>
          <div style={{ maxWidth: 250 }}>{this.props.data.name}</div>
          {this.getExpansionButton()}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
            {this.props.data.number}| ({this.getCredits()})
        </Card.Subtitle>
        {this.getDescription()}

        </Card.Body>
        <Form>
            <Form.Group controlId="ratings">
              <Form.Control as="select" ref={this.rating} onChange={() => this.setRatedCourses(this.rating.current.value)}>
                {this.getRate()}
              </Form.Control>
            </Form.Group>
          </Form>
      </Card>
    )
  }

  getRate() {
    let ratings = [<option key="No Rating">No Rating</option>];
    for (var i = 1; i < 6; i++) {
      let currRating = <option key={i}>{i}</option>;
      ratings.push(currRating);
    }

    return ratings;
  }

  setRatedCourses() {
    let rated = {"number":this.props.data.number, "rating":this.rating.current.value};
    this.props.ratedCourse(rated);
  }

  // Code below copied from Course.js

  setExpanded(value) {
    this.setState({expanded: value});
  }

  getExpansionButton() {
    let buttonText = "▼";
    let buttonOnClick = () => this.setExpanded(true);

    if (this.state.expanded) {
      buttonText = "▲";
      buttonOnClick = () => this.setExpanded(false);
    }

    return (
      <Button
        variant="outline-dark"
        style={{
          width: 25,
          height: 25,
          fontSize: 12,
          padding: 0,
          position: "absolute",
          right: 20,
          top: 20,
        }}
        onClick={buttonOnClick}
      >
        {buttonText}
      </Button>
    );
  }

  getDescription() {
    if(this.state.expanded) {
      return (
        <div>
          <p>Subject: {this.props.data.subject}</p>
          <p>{this.props.data.description}</p>
        </div>
      )
    }
  }

  getCredits() {
    if (this.props.data.credits === 1) return "1 credit";
    else return this.props.data.credits + " credits";
  }
}

export default Completed;