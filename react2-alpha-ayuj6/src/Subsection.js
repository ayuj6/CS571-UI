import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

import "./App.css";

class Subsection extends React.Component {
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
            alert("You will not be able to enroll in this course as you have not met the requisites of this course");
            return;
          }
        }
        break;
      }
    }
  }

}

export default Subsection;