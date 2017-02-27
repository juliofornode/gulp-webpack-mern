import "./app.scss";

import React, {Component} from "react";

class AppContainer extends Component {
	componentDidMount() {
		console.log("this comes from componentDidMount of AppContainer");
	}

	render() {
		return (
			<section>
				<h1>Hello World, again</h1>
				<button onClick={this._click.bind(this)}>click</button>
			</section>
		);
	}

	_click() {
		console.log("the button was clicked");
	}
}

export default AppContainer;
