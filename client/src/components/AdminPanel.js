import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import userService from '../services/users';

const AdminPanel = ({ admin, setErrorMessage }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await userService.getAll(admin.token);
      setUsers(data);
    };
    fetchProfile();
  }, []);

  const changeAccess = async (id, disabled) => {
    console.log(disabled);
    try {
      const updatedUser = await userService.disable(id, admin.token, {
        disabled: !disabled,
      });
      const newUsers = users.map((u) => (u.id === id ? updatedUser : u));
      setUsers(newUsers);
    } catch (exception) {
      setErrorMessage('Signup failed');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <div>
      <h1>Admin panel:</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>username</th>
            <th>id</th>
            <th>created</th>
            <th>updated</th>
            <th>admin</th>
            <th>disabled</th>
            <th>access</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.id}</td>
              <td>{u.createdAt}</td>
              <td>{u.updatedAt}</td>
              <td>{u.admin ? 'yes' : 'no'}</td>
              <td>{u.disabled ? 'yes' : 'no'}</td>
              <td>
                <button onClick={() => changeAccess(u.id, u.disabled)}>
                  {u.disabled ? 'enable' : 'disable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AdminPanel.propTypes = {
  admin: PropTypes.object,
  setErrorMessage: PropTypes.func,
};

export default AdminPanel;
