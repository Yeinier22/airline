import { Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/landingPage";
import { ChooseFlight } from "./components/chooseFlight";
import Checkout from "./components/checkout";
import { FlightProvider } from "./utils/flightContext";
import { SearchDataProvider } from "./hooks/searchData";
import Footer from "./components/footer";
import "./App.css";
import Header from "./components/header";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main">
        <SearchDataProvider>
          <FlightProvider>
            <Routes>
              {/*<Route path="/" element={<LandingPage />} />*/}
              <Route path="/" element={<ChooseFlight />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </FlightProvider>
        </SearchDataProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;
