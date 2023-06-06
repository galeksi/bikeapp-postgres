import { useState } from 'react';
import { PropTypes } from 'prop-types';

import '../styles/Togglable.css';

const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = visible ? { display: 'none' } : {};
  const showWhenVisible = visible ? {} : { display: 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <button className="btn-primary-lg" onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div className="togglable" style={showWhenVisible}>
        {props.children}
        <button className="btn-secondary-lg" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </div>
  );
};

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  children: PropTypes.element,
};

export default Togglable;
