import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [],
      filteredCourses: [],
      subjects: [],
      cartCourses: {},
      completedCourses: [],
      ratedCourses: [],
    };
  }

  componentDidMount() {
    this.loadInitialState();
  }

  async loadInitialState() {
    let courseURL = "http://cs571.cs.wisc.edu:53706/api/react/classes";
    let courseData = await (await fetch(courseURL)).json();

    let completeURL = "http://cs571.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed";
    let completeData = await (await fetch(completeURL)).json();


    this.setState({
      allCourses: courseData,
      filteredCourses: courseData,
      subjects: this.getSubjects(courseData),
      completedCourses: completeData.data,
      ratedCourses:[],
    });
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (let i = 0; i < data.length; i++) {
      if (subjects.indexOf(data[i].subject) === -1)
        subjects.push(data[i].subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  addCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses)); // I think this is a hack to deepcopy
    let courseIndex = this.state.allCourses.findIndex((x) => {
      return x.number === data.course;
    });
    if (courseIndex === -1) {
      return;
    }

    if ("subsection" in data) {
      if (data.course in this.state.cartCourses) {
        if (data.section in this.state.cartCourses[data.course]) {
          newCartCourses[data.course][data.section].push(data.subsection);
        } else {
          newCartCourses[data.course][data.section] = [];
          newCartCourses[data.course][data.section].push(data.subsection);
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        newCartCourses[data.course][data.section].push(data.subsection);
      }
    } else if ("section" in data) {
      if (data.course in this.state.cartCourses) {
        newCartCourses[data.course][data.section] = [];

        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      } else {
        newCartCourses[data.course] = {};
        newCartCourses[data.course][data.section] = [];
        for (
          let i = 0;
          i <
          this.state.allCourses[courseIndex].sections[data.section].subsections
            .length;
          i++
        ) {
          newCartCourses[data.course][data.section].push(
            this.state.allCourses[courseIndex].sections[data.section]
              .subsections[i]
          );
        }
      }
    } else {
      newCartCourses[data.course] = {};

      for (
        let i = 0;
        i < this.state.allCourses[courseIndex].sections.length;
        i++
      ) {
        newCartCourses[data.course][i] = [];

        for (
          let c = 0;
          c < this.state.allCourses[courseIndex].sections[i].subsections.length;
          c++
        ) {
          newCartCourses[data.course][i].push(
            this.state.allCourses[courseIndex].sections[i].subsections[c]
          );
        }
      }
    }
    this.setState({ cartCourses: newCartCourses });
  }

  removeCartCourse(data) {
    let newCartCourses = JSON.parse(JSON.stringify(this.state.cartCourses));

    if ("subsection" in data) {
      newCartCourses[data.course][data.section].forEach((_subsection) => {
        if (_subsection.number === data.subsection.number) {
          newCartCourses[data.course][data.section].splice(
            newCartCourses[data.course][data.section].indexOf(_subsection),
            1
          );
        }
      });
      if (newCartCourses[data.course][data.section].length === 0) {
        delete newCartCourses[data.course][data.section];
      }
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else if ("section" in data) {
      delete newCartCourses[data.course][data.section];
      if (Object.keys(newCartCourses[data.course]).length === 0) {
        delete newCartCourses[data.course];
      }
    } else {
      delete newCartCourses[data.course];
    }
    this.setState({ cartCourses: newCartCourses });
  }

  getCartData() {
    let cartData = [];

    for (const courseKey of Object.keys(this.state.cartCourses)) {
      let course = this.state.allCourses.find((x) => {
        return x.number === courseKey;
      });

      cartData.push(course);
    }
    return cartData;
  }

  getCompletedCourses() {
    let completedCourseInfo = [];
    let ourCompleted = this.state.completedCourses;
    let all = this.state.allCourses;

    for(const completed in ourCompleted) {
      let current = all.find((curr) => {return curr.number === ourCompleted[completed]});
      let completedCourse = current;
      completedCourseInfo.push(completedCourse);
    }
    return completedCourseInfo;
  }

  rateCourses(ratedCourse) {
    let tempCourses = this.state.ratedCourses;
    let len = this.state.ratedCourses.length;
    let currRating = ratedCourse.rating;

    if (len !== 0) {
      let temp2 = tempCourses.filter(currCourse => currCourse.number !== ratedCourse.number);
      tempCourses = temp2;
      if (currRating !== "No Rating") {
        tempCourses.push(ratedCourse);
      }
    }
    else {
      tempCourses.push(ratedCourse);
    }
    this.setState({ratedCourses: tempCourses});
  }

  render() {
    return (
      <>
        <Tabs
          defaultActiveKey="search"
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Tab eventKey="search" title="Search" style={{ paddingTop: "5vh" }}>
            <Sidebar
              mode = "SearchAndFilter"
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
            />
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.filteredCourses}
                allCourses = {this.state.allCourses}
                mode="courses"
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                completedCourses={this.state.completedCourses}
                cartCourses={this.state.cartCourses}
              />
            </div>
          </Tab>
          <Tab eventKey="cart" title="Cart" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.getCartData()}
                mode="cart"
                addCartCourse={(data) => this.addCartCourse(data)}
                removeCartCourse={(data) => this.removeCartCourse(data)}
                cartCourses={this.state.cartCourses}
              />
            </div>
          </Tab>

          <Tab eventKey="completedCourses" title="Completed Courses" style={{ paddingTop: "5vh" }}>
          <Sidebar mode="rating"/> 
            <div style={{ marginLeft: "20vw" }}>
            <CourseArea 
              data={this.getCompletedCourses()} 
              mode="completed" 
              ratedCourses={(ratedCourse) => this.rateCourses(ratedCourse)} />
            </div>
          </Tab>
          <Tab eventKey="recommendedCourses" title="Recommended Courses" style={{paddingTop: '5vh'}}>
            <div style={{marginLeft: '20vw'}}>
              <CourseArea 
                data={this.state.ratedCourses} 
                mode="recommended" 
                completedCourses={this.getCompletedCourses()}
                allCourses={this.state.allCourses} />
            </div>
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default App;
