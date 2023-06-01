import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

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
import Signup from './components/Signup';

const App = () => {
  const [stations, setStations] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStations = async () => {
      const allStations = await stationService.getAll();
      setStations(allStations);
    };

    const checkUser = () => {
      const loggedUserJSON = window.localStorage.getItem('loggedUser');
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        const decodedToken = jwt_decode(user.token);
        const currentDate = new Date();

        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          setNotification('Session expired, please login.');
          setTimeout(() => setNotification(null), 5000);
        } else {
          setUser(user);
        }
      }
    };

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
      navigate('/');
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

  const userAuth =
    user === null ? (
      <div>
        <Togglable buttonLabel={'Login'} buttonLabelBack={'cancel'}>
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
        </Togglable>
        <Link to={'/signup'}>Register</Link>
      </div>
    ) : (
      <div>
        <p>
          <Link to={`/user/${user.username}`}>PROFILE</Link>
          <button onClick={handleLogout}>Logout</button>
        </p>
      </div>
    );

  if (stations.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="container">
      <div>
        <div>
          {userAuth}
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
          <Route
            path="/user/:username"
            element={
              <User
                user={user}
                stations={stations}
                setStations={setStations}
                setNotification={setNotification}
                setErrorMessage={setErrorMessage}
              />
            }
          />
          <Route path="/trips" element={<Trips stations={stations} />} />
          <Route
            path="/station/:id"
            element={<Station stations={stations} />}
          />
          <Route
            path="/signup"
            element={
              <Signup
                setUser={setUser}
                setNotification={setNotification}
                setErrorMessage={setErrorMessage}
              />
            }
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
