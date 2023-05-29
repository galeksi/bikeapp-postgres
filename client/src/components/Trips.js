import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import tripService from '../services/trips';
import ReactPaginate from 'react-paginate';
import { paginationLoader } from '../utils/helpers';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import '../styles/pagination.css';

const Trips = ({ stations }) => {
  const [allTrips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [departureFilter, setDepartureFilter] = useState();
  const [returnFilter, setReturnFilter] = useState();
  const [startDate, setStartDate] = useState();

  // Sets options for dropdown select to filter departure and return stations
  const stationOptions = stations.map((s) => ({
    value: s.id,
    label: s.nimi,
  }));

  useEffect(() => {
    const fetchTrips = async () => {
      const allTrips = await tripService.getAll();
      setTrips(allTrips);
    };
    fetchTrips();
  }, []);

  if (allTrips.length === 0) {
    return <h1>Loading...</h1>;
  }

  // Decides if all trips or filter result is added for pagination and initial view
  const trips = filteredTrips.length === 0 ? allTrips : filteredTrips;
  const tripsToView = paginationLoader(trips, currentPage, 50);

  // Changes pagination page
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Triggers filtered query with variables and limits to 100 to reduce browser load
  const filterTrips = async () => {
    const params = {};
    if (departureFilter) params.departureStation = departureFilter.value;
    if (returnFilter) params.returnStation = returnFilter.value;
    if (startDate) params.date = startDate;

    const returnedTrips = await tripService.getAll({ params });

    setFilteredTrips(returnedTrips);
    setCurrentPage(0);
  };

  // Clears filter and sets State for rerender
  const clearFilter = () => {
    setFilteredTrips([]);
    setDepartureFilter();
    setReturnFilter();
    setStartDate();
  };

  return (
    <div>
      <h2>Trips</h2>
      <div>
        <div>
          <Select
            id="departurestation"
            classNamePrefix="Departure..."
            value={departureFilter}
            isClearable={true}
            isSearchable={true}
            placeholder="Departure station"
            options={stationOptions}
            onChange={setDepartureFilter}
          />
          <Select
            id="returnstation"
            classNamePrefix="Return..."
            value={returnFilter}
            isClearable={true}
            isSearchable={true}
            placeholder="Return station"
            options={stationOptions}
            onChange={setReturnFilter}
          />
          <DatePicker
            id="datepicker"
            placeholderText="Date"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div>
          <div>
            <button id="tripfilterbutton" onClick={filterTrips}>
              Filter
            </button>
            <button onClick={clearFilter}>Clear filter</button>
          </div>
        </div>
      </div>
      <ReactPaginate
        activeClassName={'item active '}
        breakClassName={'item break-me '}
        breakLabel={'...'}
        containerClassName={'pagination'}
        disabledClassName={'disabled-page'}
        marginPagesDisplayed={2}
        nextClassName={'item next '}
        nextLabel={'forward >'}
        onPageChange={handlePageClick}
        pageCount={tripsToView.pageCount}
        pageClassName={'item pagination-page '}
        pageRangeDisplayed={2}
        previousClassName={'item previous'}
        previousLabel={'< back'}
      />
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
          {tripsToView.items &&
            tripsToView.items.map((t) => (
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
  );
};

Trips.propTypes = {
  stations: PropTypes.array,
};

export default Trips;
