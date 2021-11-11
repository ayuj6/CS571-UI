import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class Recommended extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    }
  }

  render() {
    return (
      <Card style={{marginTop: "5px", marginBottom: "5px" }}>
      <Card.Body>
        <Card.Title>
          <div style={{ fontSize: 20 }}><strong>{this.props.data.name}</strong></div>
          {this.getExpansionButton()}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
            {this.props.data.number}| ({this.getCredits()})
        </Card.Subtitle>
          <p style={{fontSize: 15}}><strong>This course is recommended because you gave a similar a rating more than 2</strong></p>
            {this.getDescription()}
        </Card.Body>
      </Card>
    )
  }

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
 
  getRequisites() {
    var requisites = "";
    var requisiteInfo = this.props.data.requisites;
    var len = requisiteInfo.length;

    if (len !== 0) {
      for (var i = 0; i < len; i++) {
        var currLen = requisiteInfo[i].length;
        if (currLen === 0) {
          break;
        }
        requisites = requisites + "(";
        for (var j = 0; j < currLen; j++) {
          if (j + 1 === currLen) {
            requisites = requisites + `${requisiteInfo[i][j]})`;
          }
          else {
            requisites = requisites + `${requisiteInfo[i][j]} OR `;
          }
        }
        if (i + 1 === len) {
          break;
        } else {
          requisites = requisites + " AND ";
        }
      }
    }
    else {
      requisites = "None";
    }
    return requisites;
  }

  getDescription() {
    if(this.state.expanded) {
      return (
        <div>
          <p><strong>Subject:</strong> {this.props.data.subject}</p>
          <p>{this.props.data.description}</p>
          <p><strong>Requisites: </strong>
            {this.getRequisites()}
          </p>
          <p><strong>Keywords:</strong> {this.props.data.keywords.toString()}</p>
        </div>
      )
    }
  }


  getCredits() {
    if (this.props.data.credits === 1) return "1 credit";
    else return this.props.data.credits + " credits";
  }
}

export default Recommended;