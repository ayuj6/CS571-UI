import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from 'react-bootstrap/Alert';

import "./App.css";
import Subsection from "./Subsection";

class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
    };
  }

  render() {
    return (
      <Accordion.Item
        key={this.props.sectionKey}
        eventKey={this.props.sectionKey}
      >
        <Accordion.Header
          variant="link"
          style={{ height: 63, display: "flex", alignItems: "center" }}
        >
          {this.props.data.number}
          {this.getSectionButton(this.props.sectionKey)}
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
          
        <Accordion.Body>
          <Card.Body>
            {JSON.stringify(this.props.data.time)}
            {this.getSubsections()}
          </Card.Body>
        </Accordion.Body>
      </Accordion.Item>
    );
  }

  getSubsections() {
    let subsections = [];

    for (let i = 0; i < this.props.data.subsections.length; i++) {
      subsections.push(
        <Subsection
          key={this.props.data.subsections[i].number}
          data={this.props.data.subsections[i]}
          addCartCourse={this.props.addCartCourse}
          removeCartCourse={this.props.removeCartCourse}
          completedCourses={this.props.completedCourses}
          allCourses={this.props.allCourses}
          cartCourses={this.props.cartCourses}
          courseKey={this.props.courseKey}
          sectionKey={this.props.sectionKey}
          subsectionKey={i}
        />
      );
    }

    return <Accordion defaultActiveKey="0">{subsections}</Accordion>;
  }

  getSectionButton(section) {
    let buttonVariant = "dark";
    let buttonOnClick = (e) => this.addSection(e, section);
    let buttonText = "Add Section";

    if (this.props.courseKey in this.props.cartCourses) {
      if (section in this.props.cartCourses[this.props.courseKey]) {
        buttonVariant = "outline-dark";
        buttonOnClick = (e) => this.removeSection(e, section);
        buttonText = "Remove Section";
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

  addSection(e, section) {
    e.stopPropagation();
    this.meetRequisites();
    this.props.addCartCourse({
      course: this.props.courseKey,
      section: section,
    });
  }

  removeSection(e, section) {
    e.stopPropagation();
    this.props.removeCartCourse({
      course: this.props.courseKey,
      section: section,
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

export default Section;
