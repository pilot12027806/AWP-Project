import logo from "../sand-clock.png";
import "../App.css";

function Loading() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Loading... Please wait.</p>
      </header>
    </div>
  );
}

export default Loading;
