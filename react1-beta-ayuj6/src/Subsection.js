import React from 'react'
import './App.css'
import { Button } from 'react-bootstrap';

class Subsection extends React.Component {

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

	render() {
		var curr = this.props.data;
		var cart = this.props.cartMode;
		return (
			<ul>
				<li>
					{curr.number}
					<Button style={{ display:'inline-end', float: 'right', marginLeft: '10px'}}
						onClick={(cart) ?
							() => this.props.removeSubsections(curr) :
							() => this.props.addSubsections(curr)}
					>
						{(cart) ? "Remove Subsection" : "Add Subsection"}
					</Button>
				</li>
				<ul>
					<li>{curr.location}</li>
					<li>Meeting Times <ul>{this.getSchedule()} </ul></li>
				</ul>
			</ul>
		)
	}
}

export default Subsection;