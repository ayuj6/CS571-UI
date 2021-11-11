import React from 'react';
import './App.css';
import Section from './Section'
import { Accordion, Button } from 'react-bootstrap';

class Course extends React.Component {

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

  getSections() {
    var sectionInfo = this.props.data.sections;
    var sections = [];
    var cart = this.props.cartMode;

    for (var i = 0; i < sectionInfo.length; i++) {
      var currentSection = sectionInfo[i];
      if (cart) {
        sections.push(
          <Section key={currentSection.number} data={currentSection} cartMode={cart}
            removeSections={(section) => this.removeSections(section)} selectData={(data) => this.selectData(data)} />)
      }
      else {
        sections.push(
          <Section key={currentSection.number} data={currentSection} cartMode={cart} addSections={(section) => this.addSections(section)} />)
      }
    }

    return sections;
  }

  addSections(addedSection) {
    var currentCourse = JSON.parse(JSON.stringify(this.props.data));
    currentCourse.sections = [];
    currentCourse.sections.push(addedSection);
    this.props.addCourses(currentCourse);
  }

  removeSections(removedSection) {
    var remaining = this.props.data.sections.filter(section => section.number !== removedSection.number);
    var data = this.props.data;
    data.sections = remaining;
    this.props.selectData(data);
  }

  selectData(data) {
    var currentCourse = this.props.data;
    for (var i = 0; i < currentCourse.sections.length; i++) {
      if (currentCourse.sections[i].number === data.number) {
        currentCourse.sections[i].subsections = data.subsections;
      }
    }
    this.props.data.sections = currentCourse.sections;
    this.props.selectData(this.props.data);
  }

  render() {
    const courseName = this.props.data.name;
    var curr = this.props.data;
    var cart = this.props.cartMode;
    return (

      <Accordion id="acc">
        <Accordion.Header>
          <h5>({curr.number}) {courseName} | ({curr.credits} credits)</h5>
        </Accordion.Header>

        <Accordion.Body>
          <h5>
            Subject: {curr.subject}
            <Button
              onClick={(cart) ? () => this.props.removeCourses(curr) : () => this.props.addCourses(JSON.parse(JSON.stringify(this.props.data)))}>
              {(cart) ? "Remove Course" : "Add Course"}
            </Button>
          </h5>

          <p>{curr.description}</p>
          <p><strong>Requisites: </strong> {this.getRequisites()}</p>
          <p><strong>Keywords: </strong>{curr.keywords.toString()}</p>

          {(curr.sections.length > 0) ? <h5>Sections</h5> : null}

          {this.getSections()}
        </Accordion.Body>
      </Accordion>
    )
  }
}

export default Course;
