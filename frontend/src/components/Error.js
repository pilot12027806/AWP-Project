import logo from "../remove.png";
import "../App.css";

function Error() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Failed to load data. Please try again.</p>
      </header>
    </div>
  );
}

export default Error;
