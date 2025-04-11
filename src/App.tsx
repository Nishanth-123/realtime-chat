import TelepartyProvider from "./context/TelepartyContext";
import "./App.css";
import Content from "./components/content/Content";

function App() {
  return (
    <TelepartyProvider>
      <div className="app">
        <header className="app-header">
          <h1>Teleparty Chat</h1>
        </header>
        <Content />
        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Teleparty Chat</p>
        </footer>
      </div>
    </TelepartyProvider>
  );
}

export default App;
