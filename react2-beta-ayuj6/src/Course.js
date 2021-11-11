import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Accordion from "react-bootstrap/Accordion";
import Alert from 'react-bootstrap/Alert';

import "./App.css";
import Section from "./Section";

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      showModal: false,

      showAlert: false,
    };
  }

  render() {
    return (
      <Card style={{ marginTop: "5px", marginBottom: "5px" }}>
        <Card.Body>
          <Card.Title>
            <div style={{ maxWidth: 250 }}>{this.props.data.name}</div>
            {this.getExpansionButton()}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {this.props.data.number}| ({this.getCredits()})
          </Card.Subtitle>
          {this.getDescription()}
          <Button variant="dark" style={{float: "right"}} onClick={() => this.openModal()}>
            View sections
          </Button>
        </Card.Body>
        <Modal 
          show={this.state.showModal} 
          onHide={() => this.closeModal()} 
          centered 
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.props.data.name}</Modal.Title>
          </Modal.Header>

          
        <Alert show={this.state.showAlert} variant="danger">
            <Alert.Heading>You cannot enroll in this course</Alert.Heading>
            <p>It will be added to your cart but you will not be able to enroll in it as you have not met the requisites to take this course.</p>
            <div className="d-flex justify-content-end">
                <Button onClick={() => this.setState({showAlert: false})} variant="outline-danger">
                  Okay
                </Button>
            </div>
          </Alert>    


          <Modal.Body>{this.getSections()}</Modal.Body>
          <Modal.Footer>
            {this.getCourseButton()}
            <Button variant="secondary" onClick={() => this.closeModal()}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    );
  }

  meetRequisites() {
    let req = this.props.data.requisites;
    let completedCourses = this.props.completedCourses;
    let meetReq = false;

    for (const courseReq of req) {
      meetReq = false;
      for (const currComplete of completedCourses) {
        if (courseReq.includes(currComplete)) {
          meetReq = true;
          break;
        }
      }
      if (meetReq === false) {
        this.setState({showAlert: true});
        return;
      }
    }
  }

  getCourseButton() {
    let buttonVariant = "dark";
    let buttonOnClick = () => this.addCourse();
    let buttonText = "Add Course";

    if (this.props.courseKey in this.props.cartCourses) {
      buttonVariant = "outline-dark";
      buttonOnClick = () => this.removeCourse();
      buttonText = "Remove Course";
    }

    return (
      <Button variant={buttonVariant} onClick={buttonOnClick}>
        {buttonText}
      </Button>
    );
  }

  getSections() {
    let sections = [];

    for (let i = 0; i < this.props.data.sections.length; i++) {
      sections.push(
        <Section
          key={this.props.data.number + i}
          data={this.props.data.sections[i]}
          addCartCourse={this.props.addCartCourse}
          removeCartCourse={this.props.removeCartCourse}
          completedCourses={this.props.completedCourses}
          allCourses={this.props.allCourses}
          cartCourses={this.props.cartCourses}
          courseKey={this.props.courseKey}
          sectionKey={i}
        />
      );
    }

    return <Accordion defaultActiveKey="0">{sections}</Accordion>;
  }

  addCourse() {
    this.meetRequisites();
    this.props.addCartCourse({
      course: this.props.courseKey,
    });
  }

  removeCourse() {
    this.props.removeCartCourse({
      course: this.props.courseKey,
    });
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  setExpanded(value) {
    this.setState({ expanded: value });
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

export default Course;