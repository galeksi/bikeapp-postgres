import PropTypes from 'prop-types';

const StationList = ({ stations }) => {
  console.log(stations);
  return (
    <div>
      <h1>STATION LIST</h1>
    </div>
  );
};

StationList.propTypes = {
  stations: PropTypes.array,
};

export default StationList;
