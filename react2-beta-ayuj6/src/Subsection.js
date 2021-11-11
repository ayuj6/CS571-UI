import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert';

import "./App.css";

class Subsection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
    };
  }

  render() {
    return (
      <Accordion.Item
        key={this.props.subsectionKey}
        eventKey={this.props.subsectionKey}
      >
        <Accordion.Header
          variant="link"
          style={{ height: 63, display: "flex", alignItems: "center" }}
        >
          
          {this.props.data.number}
          {this.getSubsectionButton(this.props.sectionKey, this.props.data)}
        </Accordion.Header>

        <Alert show={this.state.showAlert} variant="danger">
            <Alert.Heading>You cannot enroll in this course</Alert.Heading>
            <p>It will be added to your cart but you will not be able to enroll in it as you have not met the requisites to take this course.</p>
            <div className="d-flex justify-content-end">
                <Button onClick={() => this.setState({showAlert: false})} variant="outline-danger">
                  Okay
                </Button>
            </div>
          </Alert>    

        <Accordion.Body>{JSON.stringify(this.props.data.time)}</Accordion.Body>
      </Accordion.Item>
    ); 
  }

  getSubsectionButton(section, subsection) {
    let buttonVariant = "dark";
    let buttonOnClick = (e) => this.addSubsection(e, section, subsection);
    let buttonText = "Add Subsection";

    if (this.props.courseKey in this.props.cartCourses) {
      if (section in this.props.cartCourses[this.props.courseKey]) {
        if (
          this.props.cartCourses[this.props.courseKey][section].some(
            (_subsection) => _subsection.number === subsection.number
          )
        ) {
          buttonVariant = "outline-dark";
          buttonOnClick = (e) => this.removeSubsection(e, section, subsection);
          buttonText = "Remove Subsection";
        }
      }
    }

    return (
      <Button
        as="a"
        variant={buttonVariant}
        onClick={buttonOnClick}
        style={{ position: "absolute", right: 50 }}
      >
        {buttonText}
      </Button>
    );
  }

  addSubsection(e, section, subsection) {  
    e.stopPropagation();
    this.meetRequisites();
    this.props.addCartCourse({
      course: this.props.courseKey,
      section: section,
      subsection: subsection,
    });
  }

  removeSubsection(e, section, subsection) {
    e.stopPropagation();
    this.props.removeCartCourse({
      course: this.props.courseKey,
      section: section,
      subsection: subsection,
    });
  }

  meetRequisites() {
    let all = this.props.allCourses;
    let curr = this.props.courseKey;
    let completedCourses = this.props.completedCourses;
    let meetReq = false;

    for(var i =0; i<all.length; i++){
      if(curr === all[i].number){
        let thisCourse = all[i];
        let req = thisCourse.requisites;

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
        break;
      }
    }
  }

}

export default Subsection;