import React from "react";
import "./App.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      subjects: [],
      newCourses: []
    };
  }

  componentDidMount() {
    fetch("http://cs571.cs.wisc.edu:53706/api/react/classes")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          allCourses: data,
          filteredCourses: data,
          subjects: this.getSubjects(data),
        })
      );
  }

  getSubjects(data) {
    var subjects = [];
    subjects.push("All");

    for (const course of Object.values(data)) {
      if (subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  addCourses(addedCourse) {
    var tempCourses = this.state.newCourses;
    var validCourse = false;
    var curSec = addedCourse.sections;
    var curr = curSec[0];

    for (var i = 0; i < tempCourses.length; i++) {
      var course = tempCourses[i];
      if (addedCourse.number === course.number) {
        validCourse = true;
        if (curSec.length > 1) {
          course.sections = curSec;
        }
        else {
          var validSection = false;
          for (var j = 0; j < course.sections.length; j++) {
            var currentSec = course.sections[j];
            if (currentSec.number === curr.number) {
              validSection = true;
              if (curr.subsections.length !== 1) {
                currentSec.subsections = curr.subsections;
              } else {
                if (currentSec.subsections.filter(currSubsec => currSubsec.number === curr.subsections[0].number).length <= 0) {
                  currentSec.subsections.push(curr.subsections[0]);
                }
              }
            }
          }
          if (validSection === false) {
            course.sections.push(curr);
          }
        }
      }
    }

    if (validCourse === false) {
      tempCourses.push(addedCourse);
    }
    this.setState({ newCourses: tempCourses });
  }

  removeCourses(courses) {
    this.setState({ newCourses: courses });
  }

  render() {
    return (
      <>
      <div id="pg_head" class="page-header">
        <h1> Welcome to UW Course Search</h1>
      </div>
        <Tabs
          defaultActiveKey="search"
          style={{
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Tab eventKey="search" title="Search" style={{backgroundColor: "grey", height:"80rem"}}>
            
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
            />

            <div >
              <CourseArea
                data={this.state.filteredCourses}
                allData={this.state.allCourses}
                cartMode={false}
                addCourses={(courses) => this.addCourses(courses)}
              />
            </div>
          </Tab>
          <Tab  eventKey="cart" title="Cart" style={{backgroundColor: "grey", height:"80rem"}}>
              <CourseArea
                data={this.state.newCourses}
                allData={this.state.allCourses}
                cartMode={true}
                removeCourses={(courses) => this.removeCourses(courses)} />
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default App;
