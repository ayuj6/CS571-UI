import React from 'react';
import './App.css';
import Course from './Course';
import { Accordion } from 'react-bootstrap';

class CourseArea extends React.Component {
  getCourses() {
    var courses = [];

    for (const course of Object.values(this.props.data)) {
      courses.push(
        <Course
          key={course.name}
          data={course}
          cartMode={false}
          addCourses={(courses) => this.addCourses(courses)}
        />
      )
    }

    return courses;
  }

  getAddedCourses() {
    var courses = [];
    var data = this.props.data;

    for (var i = 0; i < data.length; i++) {
      var course = data[i];
      courses.push(
        <Course
          key={course.name}
          data={course}
          cartMode={true}
          removeCourses={(courses) => this.removeCourses(courses)}
          selectData={(data) => this.selectData(data)}
        />
      )
    }
    return courses;
  }

  addCourses(courses) {
    this.props.addCourses(courses);
  }

  removeCourses(removed) {
    var current = this.props.data;
    var removeCourse = current.filter(course => course.number !== removed.number);
    this.props.removeCourses(removeCourse);
  }

  selectData(data) {
    var courseArray = this.props.data;
    for (var i = 0; i < courseArray.length; i++) {
      if (courseArray[i].number === data.number) {
        courseArray[i] = data;
      }
    }
    this.props.removeCourses(courseArray);
  }

  render() {
    var cart = this.props.cartMode;
    return (
      <Accordion>
        {(cart) ? this.getAddedCourses() : this.getCourses()}
      </Accordion>
    )
  }
}

export default CourseArea;
