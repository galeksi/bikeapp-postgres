import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Station from './components/Station';
import StationList from './components/StationList';
import Trips from './components/Trips';
import User from './components/User';

import stationService from './services/stations';

const App = () => {
  const [stations, setStations] = useState([]);
  // Fetching all Stations from DB to serve all routes

  useEffect(() => {
    stationService.getAll().then((stations) => setStations(stations));
  }, []);

  return (
    <div>
      <div>
        <Router>
          <div>
            <h1>BIKEAPP 2023</h1>
            <div>
              <Link to="/">STATIONS </Link>
              <Link to="/trips">TRIPS </Link>
              <Link to="/user/:id">USER </Link>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<StationList stations={stations} />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/trips" element={<Trips stations={stations} />} />
            <Route
              path="/station/:id"
              element={<Station stations={stations} />}
            />
          </Routes>
        </Router>
      </div>
      <div>
        <p>Bikeapp 2023 - Aleksi Rendel</p>
      </div>
    </div>
  );
};

export default App;
