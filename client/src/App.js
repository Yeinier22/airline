import { Routes, Route } from "react-router-dom";
import { ChooseFlight } from "./components/chooseFlight";
import Checkout from "./components/checkout";
import { FlightProvider } from "./utils/flightContext";
import { SearchDataProvider } from "./hooks/searchData";
import Footer from "./components/footer";
import "./App.css";
import Header from "./components/header";
import ComingSoon from "./components/coomingSoon";

function App() {
  return (
    <SearchDataProvider> {/* ⬅️ mueve aquí */}
      <FlightProvider>
        <div className="App">
          <div id="top"></div>
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<ChooseFlight />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/destinations" element={<ComingSoon />} />
              <Route path="/about" element={<ComingSoon />} />
              <Route path="/contact" element={<ComingSoon />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </FlightProvider>
    </SearchDataProvider>
  );
}

export default App;
