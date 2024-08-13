import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/landingPage";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="" element/>
      </Routes>
    </div>
  );
}

export default App;
