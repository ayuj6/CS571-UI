import React from "react";
import "./App.css";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import SearchAndFilter from "./SearchAndFilter";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.searchAndFilter = new SearchAndFilter();
    this.subject = React.createRef();
    this.minimumCredits = React.createRef();
    this.maximumCredits = React.createRef();
    this.search = React.createRef();
    this.interest = React.createRef();
  }

  setCourses() {

      this.props.setCourses(
        this.searchAndFilter.searchAndFilter(
          this.props.courses,
          this.search.current.value,
          this.subject.current.value,
          this.minimumCredits.current.value,
          this.maximumCredits.current.value,
          this.interest.current.value,
        )
      );

  }

  handleCreditsKeyDown(e) {
    if (
      [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "Backspace",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Tab",
      ].indexOf(e.key) === -1
    )
      e.preventDefault();
  }

  handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      this.search.current.value = "";
      this.setCourses();
    }
  }

  getSubjectOptions() {
    let subjectOptions = [];

    for (const subject of this.props.subjects) {
      subjectOptions.push(<option key={subject}>{subject}</option>);
    }

    return subjectOptions;
  }

  getInterests() {
    let interestWords = [];
    let interests = [];
    let subjects = this.props.subjects;

    for (const subject of subjects) {
      let sub = subject.toLowerCase();
      interests.push(sub);
    }

    for (const course of this.props.courses) {
      for (var currKeyword of course.keywords) {
        let curr = currKeyword.toLowerCase();
        if (interests.indexOf(curr) < 0) {
          interests.push(curr);
        }
      }
    }

    for (const interest of interests) {
      let currInterest = <option key={interest}>{interest}</option>;
      interestWords.push(currInterest);
    }

    return interestWords;
  }
    
  presentInformation() {
    return(
    <Card style={{width: 'calc(20vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 52px)', position: 'fixed'}}>
      <Card.Body>
        <Card.Title><strong>
          Rating Courses
        </strong></Card.Title>
        <div>
          <p>You can now rate your previous courses based on how you felt your experience was! </p>
          <br/>
          <p><strong>1: </strong>Never taking this course again. <br/> <strong>5: </strong>I wish I could take this course every semester!</p>
          <br/>
          <br/>
          <br/>
          <p><strong> Note </strong></p>
          <ul style={{fontSize: 14}}>
            <li>You can use Arrow Keys and the Enter button to select a rating for a course.</li>
            <li>Giving a course a rating more than 2 will automatically add courses of similar interest to the "Recommended Courses" section.</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
    )
  }

  render() {
    return (
      (this.props.mode === "rating" ? 
      <>{this.presentInformation()}</>
       : 
      <>
        <Card
          style={{
            width: "calc(20vw - 5px)",
            marginLeft: "5px",
            height: "calc(100vh - 52px)",
            position: "fixed",
          }}
        >
          <Card.Body>
            <Card.Title>Search and Filter</Card.Title>
            <br></br>
            <Form>
              <Form.Group 
                controlId="formKeywords"
                onKeyDown={(e) => this.handleSearchKeyDown(e)}
                onChange={() => this.setCourses()} 
                style={{width: '100%'}}
              >
                <Form.Label>Search</Form.Label>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Form.Control
                    type="text"
                    placeholder="keyword search"
                    autoComplete="off"
                    ref={this.search}
                  />
                </div>
                <br></br>
               
              </Form.Group>

              <Form.Group controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  as="select"
                  ref={this.subject}
                  onChange={() => this.setCourses()}
                >
                  {this.getSubjectOptions()}
                </Form.Control>
                <br></br>
              </Form.Group>

              <Form.Group controlId="formInterest">
                <Form.Label>Interest Area</Form.Label>
                <Form.Control as="select" ref={this.interest} onChange={() => this.setCourses()}>
                  {this.getInterests()}
                </Form.Control>
                <br></br>
              </Form.Group>

              <div style={{ display: "flex", flexDirection: "row" }}>
                <Form.Group
                  controlId="minimumCredits"
                  onChange={() => this.setCourses()}
                  onKeyDown={(e) => this.handleCreditsKeyDown(e)}
                >
                  <Form.Label>Credits</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="minimum"
                    autoComplete="off"
                    ref={this.minimumCredits}
                  />
                </Form.Group>
                <div
                  style={{
                    marginLeft: "5px",
                    marginRight: "5px",
                    marginTop: "38px",
                  }}
                >
                  to
                </div>
                <Form.Group
                  controlId="maximumCredits"
                  style={{ marginTop: "32px" }}
                  onChange={() => this.setCourses()}
                  onKeyDown={(e) => this.handleCreditsKeyDown(e)}
                >
                  <Form.Control
                    type="text"
                    placeholder="maximum"
                    autoComplete="off"
                    ref={this.maximumCredits}
                  />
                   <br></br>
                </Form.Group>
              </div>
              <div>
              <br/>
          <br/>
          <br/>
          <p><strong> Note </strong></p>
          <ul style={{fontSize: 14}}>
            <li>You can use Arrow Keys and the Enter button to select a rating for a course.</li>
            <li>The course view will automatically update when a filter is selected.</li>
          </ul>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </>
      )
    );
  }
}

export default Sidebar;