import "./client.scss";
import ReactDOM from "react-dom";

function main() {
	//need to use .default() because we use export default in the source file
	const routes = require("./routes").default();
	ReactDOM.render(routes, document.getElementById("mount"));
}

main();

if (module.hot) {
	module.hot.accept("./routes", () => {
		main();
	});
}
