import React from 'react'
import './App.css'
import Subsection from './Subsection.js'
import { Button } from 'react-bootstrap';

class Section extends React.Component {

	getSchedule() {
		var sched = [];
		var timings = this.props.data.time;
		var key = Object.keys(timings);
		key.map(times => {
			sched.push(
				<li>{times}: {timings[times]}</li>
			)
		});
		return sched;
	}

	getSubsections() {
		var subSectionInfo = this.props.data.subsections;
		var subSectionList = [];

		if (subSectionInfo.length === 0) {
			return subSectionList;
		}
		var cart = this.props.cartMode;

		for (var i = 0; i < subSectionInfo.length; i++) {
			var subSec = subSectionInfo[i];
			subSectionList.push(
				<li style={{ listStyleType: 'none' }}>
					{(cart) ?
						<Subsection
							data={subSec}
							cartMode={cart}
							removeSubsections={(subsection) => this.removeSubsections(subsection)}
						/> :
						<Subsection
							data={subSec}
							cartMode={cart}
							addSubsections={(subsection) => this.addSubsections(subsection)}
						/>
					}
				</li>
			)
		}

		return subSectionList;
	}


	addSubsections(subsection) {
		var currentSection = JSON.parse(JSON.stringify(this.props.data));
		currentSection.subsections = [];
		currentSection.subsections.push(subsection);
		this.props.addSections(currentSection);
	}

	removeSubsections(subsection) {
		var currentSection = JSON.parse(JSON.stringify(this.props.data));
		currentSection.subsections = currentSection.subsections.filter(currentSubsec => currentSubsec.number !== subsection.number);
		this.props.data.subsections = currentSection.subsections;
		this.props.selectData(this.props.data);
	}

	render() {
		var curr = this.props.data;
		var cart = this.props.cartMode;
		return (
			<ul>
				<li style={{ fontSize: '14pt' }}>
					{curr.number}
					<Button
						onClick={(cart) ?
							() => this.props.removeSections(curr) :
							() => this.props.addSections(JSON.parse(JSON.stringify(this.props.data)))
						}
					>
						{(cart) ?
							"Remove Section" :
							"Add Section"
						}
					</Button>
				</li>
				<ul>
					<li>Instructor: {curr.instructor}</li>
					<li>Location: {curr.location}</li>
					<li>Meeting Times</li>
					<ul>
						{this.getSchedule()}
					</ul>
				</ul>
				{(curr.subsections.length > 0) ?
					<li style={{ listStyleType: 'none', fontSize: '14pt' }}>Subsections</li> : null}
				{this.getSubsections()}
			</ul>
		)
	}
}

export default Section;