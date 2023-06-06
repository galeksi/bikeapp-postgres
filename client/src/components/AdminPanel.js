import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import userService from '../services/users';
import stationService from '../services/stations';
import uploadService from '../services/datauploads';

import '../styles/AdminPanel.css';

const AdminPanel = ({
  admin,
  stations,
  setStations,
  setErrorMessage,
  setNotification,
}) => {
  const [users, setUsers] = useState([]);
  const [searchedStations, setSearchedStations] = useState([]);
  const [search, setSearch] = useState('');
  // const [uploadType, setUploadType] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await userService.getAll(admin.token);
      setUsers(data);
    };
    fetchProfile();
  }, []);

  const changeAccess = async (id, disabled) => {
    try {
      const updatedUser = await userService.disable(id, admin.token, {
        disabled: !disabled,
      });
      const newUsers = users.map((u) => (u.id === id ? updatedUser : u));
      setUsers(newUsers);
    } catch (exception) {
      setErrorMessage('Update failed', exception);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const changeAdmin = async (id, isAdmin) => {
    if (window.confirm('Do you want to change admin roles?')) {
      try {
        const updatedUser = await userService.admin(id, admin.token, {
          admin: !isAdmin,
        });
        const newUsers = users.map((u) => (u.id === id ? updatedUser : u));
        setUsers(newUsers);
      } catch (exception) {
        setErrorMessage('Update failed', exception);
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const deleteUser = async (id, name) => {
    if (window.confirm(`Do you want to delete ${name}?`)) {
      try {
        await userService.destroy(id, admin.token);
        const newUsers = users.filter((u) => u.id !== id);
        setUsers(newUsers);
        setNotification(`${name} deleted!`);
        setTimeout(() => setNotification(null), 5000);
      } catch (exception) {
        setErrorMessage('Deletion failed', exception);
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const searchStations = (event) => {
    event.preventDefault();
    const filteredStations = stations.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(search.toLowerCase())
    );
    setSearchedStations(filteredStations);
  };

  const clearSearch = () => {
    setSearch('');
    setSearchedStations([]);
  };

  const updateStation = async (event) => {
    event.preventDefault();
    const stationId = event.target.stationId.value;
    const capacity = event.target.capacity.value;

    if (capacity === '') {
      window.confirm('No valid capacity');
      return null;
    }

    try {
      const updatedStation = await stationService.update(
        admin.id,
        admin.token,
        { capacity }
      );
      const newStations = stations.map((s) =>
        s.id === Number(stationId) ? updatedStation : s
      );

      setStations(newStations);
      setSearchedStations([updatedStation]);
      setNotification(`${updatedStation.nimi} updated!`);
      setTimeout(() => setNotification(null), 5000);
      setSearch('');
    } catch (exception) {
      setErrorMessage('Update failed', exception);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const sendData = async (file, type) => {
    try {
      const response = await uploadService[type](admin.token, file);
      console.log(response);
      setNotification('Data uploaded!');
      setTimeout(() => setNotification(null), 5000);
    } catch (exception) {
      setErrorMessage('Upload failed', exception);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleCsvUpload = async (event) => {
    event.preventDefault();
    const file = event.target.fileInput.files[0];

    const parseFile = new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        preview: 1,
        complete: (results) => {
          resolve(results.data[0]);
        },
      });
    });

    try {
      const preview = await parseFile;
      if (event.target.uploadType.value === 'trips') {
        if (Object.keys(preview).length !== 8) {
          window.confirm('Trips file should have 8 columns!');
          return null;
        }
        sendData(file, 'uploadTrips');
      } else if (event.target.uploadType.value === 'stations') {
        if (Object.keys(preview).length !== 13) {
          window.confirm('Trips file should have 13 columns!');
          return null;
        }
        sendData(file, 'uploadStations');
      }
    } catch (error) {
      setErrorMessage('Update failed', error);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const userTable = (
    <table>
      <thead>
        <tr>
          <th className="align-left">Name</th>
          <th className="align-left">username</th>
          <th>id</th>
          <th>created</th>
          <th>time</th>
          <th>updated</th>
          <th>time</th>
          <th>admin</th>
          <th>disabled</th>
          <th>access</th>
          <th>admin</th>
          <th>delete</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="align-left">{u.name}</td>
            <td className="align-left">{u.username}</td>
            <td>{u.id}</td>
            <td>{new Date(u.createdAt).toLocaleDateString('fi-FI')}</td>
            <td>
              {new Date(u.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </td>
            <td>{new Date(u.updatedAt).toLocaleDateString('fi-FI')}</td>
            <td>
              {new Date(u.updatedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </td>
            <td>{u.admin ? 'yes' : 'no'}</td>
            <td>{u.disabled ? 'yes' : 'no'}</td>
            <td>
              <button
                className="btn-secondary-lg"
                onClick={() => changeAccess(u.id, u.disabled)}
              >
                {u.disabled ? 'enable' : 'disable'}
              </button>
            </td>
            <td>
              <button
                className="btn-secondary-lg"
                onClick={() => changeAdmin(u.id, u.admin)}
              >
                {u.admin ? 'remove' : 'add'}
              </button>
            </td>
            <td>
              <button
                className="btn-secondary-lg"
                onClick={() => deleteUser(u.id, u.name)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const stationsList =
    searchedStations.length === 0 ? (
      <></>
    ) : (
      <table>
        <thead>
          <tr>
            <th className="align-left">Name</th>
            <th className="align-left">Address</th>
            <th>Number</th>
            <th>City</th>
            <th>Capacity</th>
            <th>Details</th>
            <th>Change capacity</th>
          </tr>
        </thead>
        <tbody>
          {searchedStations.map((s) => (
            <tr key={s.id}>
              <td className="align-left">{s.nimi}</td>
              <td className="align-left">{s.osoite}</td>
              <td>{s.number}</td>
              <td>{s.kaupunki}</td>
              <td>{s.capacity}</td>
              <td>
                <Link to={`/station/${s.id}`}>View</Link>
              </td>
              <td>
                <form onSubmit={updateStation}>
                  <input type="hidden" name="stationId" value={s.id}></input>
                  <input
                    type="number"
                    name="capacity"
                    min="1"
                    max="100"
                  ></input>
                  <button className="btn-secondary-lg" type={'submit'}>
                    Update
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );

  return (
    <div className="admin-container">
      <h1>Admin panel:</h1>
      <h2>Users</h2>
      {userTable}
      <h2>Stations</h2>
      <div>
        <form onSubmit={searchStations}>
          <input
            id="stationsearch"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button
            className="btn-primary-lg"
            id="stationsearchbutton"
            type="submit"
          >
            Search
          </button>
        </form>
        <button className="btn-secondary-lg" onClick={() => clearSearch()}>
          Clear search
        </button>
      </div>
      {stationsList}
      <h2>Datauploads</h2>
      <div>
        <form onSubmit={handleCsvUpload}>
          <input type="file" accept=".csv" name="fileInput" />
          <select name="uploadType">
            <option value="trips">Trips</option>
            <option value="stations">Stations</option>
          </select>
          <button className="btn-primary-lg" type="submit">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

AdminPanel.propTypes = {
  admin: PropTypes.object,
  stations: PropTypes.array,
  setStations: PropTypes.func,
  setErrorMessage: PropTypes.func,
  setNotification: PropTypes.func,
};

export default AdminPanel;
