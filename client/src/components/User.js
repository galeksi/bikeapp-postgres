import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdminPanel from './AdminPanel';
import Togglable from './Togglable';
import userService from '../services/users';
import tripService from '../services/trips';
import Select from 'react-select';

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

      <button type={'submit'}>Update</button>
    </form>
  );

  const newTripForm = (
    <form onSubmit={addTrip}>
      <p>Departure:</p>
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
      <input
        type="datetime-local"
        id="time-departure"
        name="time-departure"
        value={departureTime}
        onChange={({ target }) => setDepartureTime(target.value)}
      ></input>
      <p>Return:</p>
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
      <input
        type="datetime-local"
        id="time-return"
        name="time-return"
        value={returnTime}
        onChange={({ target }) => setReturnTime(target.value)}
      ></input>
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
      <button type={'submit'}>Add trip</button>
    </form>
  );

  const tripsTable = (
    <table>
      <thead>
        <tr>
          <th>Departure station</th>
          <th>Date</th>
          <th>Time</th>
          <th>Return Station</th>
          <th>Duration</th>
          <th>Distance</th>
        </tr>
      </thead>
      <tbody>
        {profile.trips &&
          profile.trips.map((t) => (
            <tr key={t.id}>
              <td>
                <Link to={`/station/${t.departureStation}`}>
                  {
                    stationOptions.find((s) => s.value === t.departureStation)
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
              <td>
                <Link to={`/station/${t.returnStation}`}>
                  {
                    stationOptions.find((s) => s.value === t.returnStation)
                      .label
                  }
                </Link>
              </td>
              <td>{(t.duration / 60).toFixed(0)}&nbsp;min</td>
              <td>{(t.distance / 1000).toFixed(1)}&nbsp;km</td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  return (
    <div>
      <div>
        <h1>Hello, {profile.name}</h1>
        <h3>
          Username: {profile.username}
          <Togglable buttonLabel={'Update password'} buttonLabelBack={'close'}>
            {passwordForm}
          </Togglable>
        </h3>
        <h3>Add trip</h3>
        {newTripForm}
        <h3>Your trips</h3>
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
