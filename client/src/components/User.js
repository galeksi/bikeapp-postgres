import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import AdminPanel from './AdminPanel';
import Togglable from './Togglable';
import userService from '../services/users';

const User = ({ user, stations, setNotification, setErrorMessage }) => {
  const [profile, setProfile] = useState([]);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  if (user === null) {
    return <h1>Access denied!</h1>;
  }

  console.log(stations);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await userService.getOne(user.id, user.token);
      setProfile(data);
    };
    fetchProfile();
  }, []);

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
      console.log(exception);
      setErrorMessage('Update failed');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const adminPanel = user.admin ? (
    <AdminPanel admin={user} setErrorMessage={setErrorMessage} />
  ) : (
    <></>
  );

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
        <table>
          <thead>
            <tr>
              <th>Departure station</th>
              <th>Station Nr</th>
              <th>Date</th>
              <th>Time</th>
              <th>Return Station</th>
              <th>Station Nr</th>
              <th>Duration</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            {profile.trips &&
              profile.trips.map((t) => (
                <tr key={t.id}>
                  <td>{t.forDeparture.nimi}</td>
                  <td>
                    <Link to={`/station/${t.forDeparture.id}`}>
                      {t.forDeparture.number}
                    </Link>
                  </td>
                  <td>{new Date(t.departure).toLocaleDateString('fi-FI')}</td>
                  <td>
                    {new Date(t.departure).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>{t.forReturn.nimi}</td>
                  <td>
                    <Link to={`/station/${t.forReturn.id}`}>
                      {t.forReturn.number}
                    </Link>
                  </td>
                  <td>{(t.duration / 60).toFixed(0)}&nbsp;min</td>
                  <td>{(t.distance / 1000).toFixed(1)}&nbsp;km</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {adminPanel}
    </div>
  );
};

User.propTypes = {
  user: PropTypes.object,
  stations: PropTypes.array,
  setNotification: PropTypes.func,
  setErrorMessage: PropTypes.func,
};

export default User;
