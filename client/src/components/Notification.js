import PropTypes from 'prop-types';

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    fontSize: 18,
    border: '3px solid green',
    borderRadius: 5,
    backgroundColor: 'lightgrey',
    padding: 10,
    marginBottom: 10,
  };

  if (message === null) {
    return null;
  }

  return <div style={notificationStyle}>{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string,
};

export default Notification;
