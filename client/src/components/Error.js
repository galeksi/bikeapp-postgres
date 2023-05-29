import PropTypes from 'prop-types';

const Error = ({ message }) => {
  const errorStyle = {
    color: 'red',
    fontSize: 18,
    border: '3px solid red',
    borderRadius: 5,
    backgroundColor: 'lightgrey',
    padding: 10,
    marginBottom: 10,
  };

  if (message === null) {
    return null;
  }

  return <div style={errorStyle}>{message}</div>;
};

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
