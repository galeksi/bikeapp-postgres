import PropTypes from 'prop-types';

const User = ({ user }) => {
  if (user === null) {
    return <h1>Access denied!</h1>;
  }

  return (
    <div>
      <h1>USER</h1>
    </div>
  );
};

User.propTypes = {
  user: PropTypes.object,
};

export default User;
