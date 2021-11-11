import React from "react";
import "./App.css";
import Course from "./Course";
import Completed from "./Completed"
import Recommended from "./Recommended"

class CourseArea extends React.Component {
  getCourses() {
    let courses = [];

    if (!this.props.cartMode) {
      for(let i = 0; i < this.props.data.length; i++){
        courses.push (
            <Course 
              key={"course_" +i} 
              data={this.props.data[i]} 
              courseKey={this.props.data[i].number} 
              addCartCourse={(data) => this.props.addCartCourse(data)} 
              removeCartCourse={(data) => this.props.removeCartCourse(data)} 
              completedCourses={this.props.completedCourses} 
              allCourses={this.props.allCourses}
              cartCourses={this.props.cartCourses}
            />
        );
      }
    } else {
      for (let i = 0; i < this.props.data.length; i++) {
        courses.push(
          <Course
            key={"cartItem_" + this.props.data[i].number}
            data={this.props.data[i]}
            allCourses = {this.state.allCourses}
            completedCourses={this.props.completedCourses}
            courseKey={this.props.data[i].number}
            addCartCourse={(data) => this.props.addCartCourse(data)}
            removeCartCourse={(data) => this.props.removeCartCourse(data)}
            cartCourses={this.props.cartCourses}
          />
        );
      }
    } 

    return courses;
  }

  getCompletedCourses() {
    let completedCourses = [];

    if (!Array.isArray(this.props.data)){
      for(const completed of Object.keys(this.props.data)){
        completedCourses.push(
          <Completed 
            key={this.props.data[completed].number} 
            data={this.props.data[completed]} 
            ratedCourse={(rated) => this.props.ratedCourses(rated)}
          />
        )
      }
    }
    else{
      for(var i =0; i < this.props.data.length; i++){
        completedCourses.push(
          <Completed 
            key={i} 
            data={this.props.data[i]} 
            courseKey={this.props.data[i].number} 
            ratedCourse={(rated) => this.props.ratedCourses(rated)}
          />
        )
      }
    }

    return completedCourses;
  }

  getRecommendedCourses() {
    let allCourses = this.props.allCourses;
    let completedCourses = this.props.completedCourses;
    let rated = this.props.data;
    let recCourses = [];
    let ratedCourses = [];
    let interests = [];
    let recommendedCourses = [];

    for (const currRate of rated) {
      if (currRate.rating < 3) {
        continue
      }
      else{
        ratedCourses.push(completedCourses.find(course => {return course.number === currRate.number}));
      }
    }

    for (const currCourse of ratedCourses) {
      if (interests.includes(currCourse.subject.toLowerCase())) {
        continue;
      }
      else{
        interests.push(currCourse.subject.toLowerCase());
      }
      for (const currkeyword of currCourse.keywords) {
        if (interests.includes(currkeyword.toLowerCase())) {
          continue;
        }
        else{
          interests.push(currkeyword.toLowerCase());
        }
      }
    }


    allCourses = allCourses.filter(course => !completedCourses.includes(course));
    for (const recommended of allCourses) {
      if (!interests.includes(recommended.subject.toLowerCase())) {
        for (const keyword of recommended.keywords) {
          if (interests.includes(keyword.toLowerCase())) {
            recCourses.push(recommended);
            break;
          }
        }
      } else {
        recCourses.push(recommended);
      }
    }

    for (const course of recCourses) {
      let thisTemp = <Recommended 
      key={course.number} 
      data={course}
    />;
      recommendedCourses.push(thisTemp);
    }

    return recommendedCourses;
  }

  showElement() {
    if (this.props.mode === "courses"){
      return this.getCourses();
    }
    else if(this.props.mode === "cart") {
      return this.getCourses();
    } 
    else if (this.props.mode === "completed") {
      return this.getCompletedCourses();
    } 
    else {
      return this.getRecommendedCourses();
    }
  }

  render() {
    return <div style={{ margin: 5, marginTop: -5 }}>{this.showElement()}</div>;
  }
}

export default CourseArea;