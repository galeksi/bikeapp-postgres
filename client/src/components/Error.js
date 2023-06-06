import PropTypes from 'prop-types';
import '../styles/Error.css';

const Error = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
