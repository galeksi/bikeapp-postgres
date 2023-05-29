import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Station from './components/Station';
import StationList from './components/StationList';
import Trips from './components/Trips';
import User from './components/User';
import Togglable from './components/Togglable';
import Notification from './components/Notification';
import Error from './components/Error';

import stationService from './services/stations';
import loginService from './services/login';
import logoutService from './services/logout';

const App = () => {
  const [stations, setStations] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  // Fetching all Stations from DB to serve all routes
  const fetchStations = async () => {
    const allStations = await stationService.getAll();
    setStations(allStations);
  };

  const checkUser = () => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  };

  useEffect(() => {
    fetchStations();
    checkUser();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
      setNotification(`${user.name} succesfully logged in`);
      setTimeout(() => setNotification(null), 5000);
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutService.logout(user.token);

      window.localStorage.removeItem('loggedUser');
      setNotification(`${user.name} succesfully logged out`);
      setUser(null);
      setTimeout(() => setNotification(null), 5000);

      navigate('/');
    } catch (exception) {
      setErrorMessage('Logout failed');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  );

  if (stations.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div>
        <div>
          {user === null ? (
            <div>
              <Togglable buttonLabel={'Login'} buttonLabelBack={'cancel'}>
                {loginForm()}
              </Togglable>
            </div>
          ) : (
            <div>
              <p>
                Hi, {user.name}
                <Link to={`/user/${user.username}`}>PROFILE</Link>
                <button onClick={handleLogout}>Logout</button>
              </p>
            </div>
          )}
          <h1>BIKEAPP 2023</h1>
          <div>
            <Link to="/">STATIONS </Link>
            <Link to="/trips">TRIPS </Link>
          </div>
        </div>
        <Notification message={notification} />
        <Error message={errorMessage} />

        <Routes>
          <Route path="/" element={<StationList stations={stations} />} />
          <Route path="/user/:username" element={<User user={user} />} />
          <Route path="/trips" element={<Trips stations={stations} />} />
          <Route
            path="/station/:id"
            element={<Station stations={stations} />}
          />
        </Routes>
      </div>
      <div>
        <p>Bikeapp 2023 - Aleksi Rendel</p>
      </div>
    </div>
  );
};

export default App;
