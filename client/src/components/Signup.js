import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import userService from '../services/users';
import loginService from '../services/login';

import '../styles/Signup.css';

const Signup = ({ setUser, setErrorMessage, setNotification }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const createUser = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords not matching!');
      setTimeout(() => setErrorMessage(null), 5000);
      return null;
    }

    try {
      await userService.create({ username, name, password });

      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      // window.localStorage.setItem('loggedUser', JSON.stringify(user));

      setNotification(`Welcome ${user.name}!`);
      setTimeout(() => setNotification(null), 5000);
      navigate('/');
    } catch (exception) {
      setErrorMessage('Signup failed');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <div>
      <form className="signup-form" onSubmit={createUser}>
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        ></input>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={name}
          onChange={({ target }) => setName(target.value)}
        ></input>

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        ></input>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Enter Confirm Password"
          value={confirmPassword}
          onChange={({ target }) => setConfirmPassword(target.value)}
        ></input>

        <button className="btn-primary-lg" type={'submit'}>
          Register
        </button>
      </form>
    </div>
  );
};

Signup.propTypes = {
  setUser: PropTypes.func,
  setErrorMessage: PropTypes.func,
  setNotification: PropTypes.func,
};

export default Signup;
