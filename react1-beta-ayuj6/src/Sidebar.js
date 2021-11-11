import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import SearchAndFilter from './SearchAndFilter';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.searchAndFilter = new SearchAndFilter();
    this.subject = React.createRef();
    this.minimumCredits = React.createRef();
    this.maximumCredits = React.createRef();
    this.search = React.createRef();
  }

  setCourses() {
    this.props.setCourses(this.searchAndFilter.searchAndFilter(this.props.courses, this.search.current.value, this.subject.current.value, this.minimumCredits.current.value, this.maximumCredits.current.value));
  }

  handleCreditsKeyDown(e) {
    if(['0','1','2','3','4','5','6','7','8','9','Backspace','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Tab'].indexOf(e.key) === -1)
      e.preventDefault();
  }

  getSubjectOptions() {
    let subjectOptions = [];

    for(const subject of this.props.subjects) {
      subjectOptions.push(<option key={subject}>{subject}</option>);
    }

    return subjectOptions;
  }

  render() {
    return (
      <>
      <div id="behind">
        <Card id ="search_filter" style={{ marginLeft: '5px', height: '13rem'}}>
          <Card.Body>
            <Card.Title id="card_title"><h2>Search and Filter</h2></Card.Title>
            <Form id = "filter_form">
              <div class = "row">
                <div class="col">
              <Form.Group controlId="formKeywords" onChange={() => this.setCourses()} style={{width: '70%'}}>
                <Form.Label id = "lab">Search</Form.Label>
                <Form.Control type="text" placeholder="Search" autoComplete="off" ref={this.search}/>
              </Form.Group>
              </div>
              <div class="col">
              <Form.Group controlId="formSubject" style={{width: '70%'}}>
                <Form.Label id="lab">Subject</Form.Label>
                <Form.Control as="select" ref={this.subject} onChange={() => this.setCourses()}>
                  {this.getSubjectOptions()}
                </Form.Control>
              </Form.Group>
              </div>
              <div class="col" align="center">
                <Form.Label id="lab">Credit</Form.Label>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <Form.Group controlId="minimumCredits" onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)} >
                  <Form.Control type="text" placeholder="minimum" autoComplete="off" ref={this.minimumCredits}/>
                </Form.Group>
                <div id="to" style={{marginLeft: '5px', marginRight: '5px', marginTop: '6px'}}>to</div>
                <Form.Group controlId="maximumCredits" onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                  <Form.Control type="text" placeholder="maximum" autoComplete="off" ref={this.maximumCredits}/>
                </Form.Group>
              </div>
              </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
        </div>
      </>
    )
  }
}

export default Sidebar;
