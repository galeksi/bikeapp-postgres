import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdminPanel from './AdminPanel';
import Togglable from './Togglable';
import userService from '../services/users';
import tripService from '../services/trips';
import Select from 'react-select';

import '../styles/User.css';

const User = ({
  user,
  stations,
  setStations,
  setNotification,
  setErrorMessage,
}) => {
  const [profile, setProfile] = useState([]);

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [departureStation, setDepartureStation] = useState({});
  const [returnStation, setReturnStation] = useState({});
  const [departureTime, setDepartureTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [distance, setDistance] = useState(0);

  if (user === null) {
    return <h1>Access denied!</h1>;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await userService.getOne(user.id, user.token);
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const stationOptions = stations.map((s) => ({
    value: s.id,
    label: `${s.number} - ${s.nimi}`,
  }));

  const updatePassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('New passwords not matching!');
      setTimeout(() => setErrorMessage(null), 5000);
      return null;
    }

    try {
      await userService.updatePassword(user.id, user.token, {
        password,
        newPassword,
      });

      setPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setNotification('Password updated');
      setTimeout(() => setNotification(null), 5000);
    } catch (exception) {
      setErrorMessage('Update failed');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const adminPanel = user.admin ? (
    <AdminPanel
      admin={user}
      stations={stations}
      setStations={setStations}
      setErrorMessage={setErrorMessage}
      setNotification={setNotification}
    />
  ) : (
    <></>
  );

  const addTrip = async (event) => {
    event.preventDefault();
    const durationInMinutes =
      (Date.parse(returnTime) - Date.parse(departureTime)) / 1000;

    if (durationInMinutes <= 0) {
      setNotification('Return must be later than return!');
      setTimeout(() => setNotification(null), 5000);
      return null;
    }

    const trip = {
      departure: departureTime,
      return: returnTime,
      departureStation: departureStation.value,
      returnStation: returnStation.value,
      distance: Number(distance) * 1000,
      duration: durationInMinutes,
      userId: user.id,
    };

    try {
      const newTrip = await tripService.create(user.token, trip);
      setProfile({ ...profile, trips: profile.trips.concat(newTrip) });

      setDepartureStation({});
      setReturnStation({});
      setDepartureTime('');
      setReturnTime('');
      setDistance(0);

      setNotification('New trip added!');
      setTimeout(() => setNotification(null), 5000);
    } catch (exception) {
      setErrorMessage('Update failed');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const passwordForm = (
    <form onSubmit={updatePassword}>
      <input
        type="password"
        name="current"
        placeholder=" Enter current password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      ></input>

      <input
        type="password"
        name="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={({ target }) => setNewPassword(target.value)}
      ></input>

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm new password"
        value={confirmNewPassword}
        onChange={({ target }) => setConfirmNewPassword(target.value)}
      ></input>

      <button className="btn-primary-lg" type={'submit'}>
        Update
      </button>
    </form>
  );

  const newTripForm = (
    <form onSubmit={addTrip}>
      <p>Departure:</p>
      <div className="user-trip">
        <input
          type="datetime-local"
          id="time-departure"
          name="time-departure"
          value={departureTime}
          onChange={({ target }) => setDepartureTime(target.value)}
        ></input>
        <Select
          id="departurestation"
          classNamePrefix="Departure..."
          value={departureStation}
          isClearable={true}
          isSearchable={true}
          placeholder="Departure station"
          options={stationOptions}
          onChange={setDepartureStation}
        />
      </div>
      <p>Return:</p>
      <div className="user-trip">
        <input
          type="datetime-local"
          id="time-return"
          name="time-return"
          value={returnTime}
          onChange={({ target }) => setReturnTime(target.value)}
        ></input>
        <Select
          id="returnstation"
          classNamePrefix="Return..."
          value={returnStation}
          isClearable={true}
          isSearchable={true}
          placeholder="Return station"
          options={stationOptions}
          onChange={setReturnStation}
        />
      </div>
      <div className="user-trip-distance">
        <p>Distance:</p>
        <input
          type="number"
          name="distance"
          placeholder="Distance"
          min="1"
          max="100"
          step=".1"
          value={distance}
          onChange={({ target }) => setDistance(target.value)}
        ></input>
        <button className="btn-primary-lg" type={'submit'}>
          Add trip
        </button>
      </div>
    </form>
  );

  const tripsTable = (
    <table>
      <thead>
        <tr>
          <th className="align-left">Departure station</th>
          <th className="align-left">Return Station</th>
          <th>Date</th>
          <th>Time</th>
          <th>Duration</th>
          <th>Distance</th>
        </tr>
      </thead>
      <tbody>
        {profile.trips &&
          profile.trips.map((t) => (
            <tr key={t.id}>
              <td className="align-left">
                <Link to={`/station/${t.departureStation}`}>
                  {
                    stationOptions.find((s) => s.value === t.departureStation)
                      .label
                  }
                </Link>
              </td>
              <td className="align-left">
                <Link to={`/station/${t.returnStation}`}>
                  {
                    stationOptions.find((s) => s.value === t.returnStation)
                      .label
                  }
                </Link>
              </td>
              <td>{new Date(t.departure).toLocaleDateString('fi-FI')}</td>
              <td>
                {new Date(t.departure).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td>{(t.duration / 60).toFixed(0)}&nbsp;min</td>
              <td>{(t.distance / 1000).toFixed(1)}&nbsp;km</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  if (profile.length === 0) {
    return (
      <>
        <h1>Profile</h1>
        <div className="loader"></div>;
      </>
    );
  }

  return (
    <div>
      <div className="user-container">
        <h1>Hello, {profile.name}</h1>
        <div className="profile-username">
          <h3>Username: {profile.username}</h3>
          <Togglable buttonLabel={'Update password'} buttonLabelBack={'close'}>
            {passwordForm}
          </Togglable>
        </div>
        <h2>Add trip:</h2>
        {newTripForm}
        <h2>Your trips:</h2>
        {tripsTable}
      </div>
      {adminPanel}
    </div>
  );
};

User.propTypes = {
  user: PropTypes.object,
  stations: PropTypes.array,
  setStations: PropTypes.func,
  setNotification: PropTypes.func,
  setErrorMessage: PropTypes.func,
};

export default User;
