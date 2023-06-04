import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import tripService from '../services/trips';
import ReactPaginate from 'react-paginate';
import { paginationLoader } from '../utils/helpers';
import Select from 'react-select';

import '../styles/Trips.css';
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

  // Decides if all trips or filter result is added for pagination and initial view
  const trips = filteredTrips.length === 0 ? allTrips : filteredTrips;
  const tripsToView = paginationLoader(trips, currentPage, 50);

  // Changes pagination page
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Triggers filtered query with variables and limits to 500 to reduce browser load
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
      {allTrips.length === 0 ? (
        <div className="loader"></div>
      ) : (
        <>
          <div className="trip-filter-bar">
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
            <input
              id="datepicker"
              type="date"
              name="start-date"
              value={startDate}
              onChange={({ target }) => setStartDate(target.value)}
            ></input>
            <button
              className="btn-primary-lg"
              id="tripfilterbutton"
              onClick={filterTrips}
            >
              Filter
            </button>
            <button className="btn-secondary-lg" onClick={clearFilter}>
              Clear
            </button>
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
                <th className="align-left">Date</th>
                <th className="align-left">Time</th>
                <th className="align-left">Departure station</th>
                <th>Station Nr</th>
                <th className="align-left">Return Station</th>
                <th>Station Nr</th>
                <th>Duration</th>
                <th>Distance</th>
              </tr>
            </thead>
            <tbody>
              {tripsToView.items &&
                tripsToView.items.map((t) => (
                  <tr key={t.id}>
                    <td className="align-left">
                      {new Date(t.departure).toLocaleDateString('fi-FI')}
                    </td>
                    <td className="align-left">
                      {new Date(t.departure).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="align-left">{t.forDeparture.nimi}</td>
                    <td>
                      <Link to={`/station/${t.forDeparture.id}`}>
                        {t.forDeparture.number}
                      </Link>
                    </td>
                    <td className="align-left">{t.forReturn.nimi}</td>
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
        </>
      )}
    </div>
  );
};

Trips.propTypes = {
  stations: PropTypes.array,
};

export default Trips;
