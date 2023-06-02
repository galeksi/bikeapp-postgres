import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import ReactPaginate from 'react-paginate';
import { paginationLoader } from '../utils/helpers';

import '../styles/map.css';
import '../styles/pagination.css';
import customMarkerIcon from '../assets/Map_marker_blue.png';

const StationList = ({ stations }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchedStations, setSearchedStations] = useState();
  const [search, setSearch] = useState('');
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();

  // Loads google API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });

  // Decides if all stations or search result is added for pagination and initial view
  const allStations = searchedStations ?? stations;
  const stationsToView = paginationLoader(allStations, currentPage, 20);

  // Google maps markers location and info
  const markers = stations.map((s) => ({
    name: s.nimi,
    number: s.number,
    address: s.osoite,
    capacity: s.capacity,
    lat: Number(s.lat),
    lng: Number(s.long),
  }));

  // Sets google map boundary and centers map accordingly
  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds();
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  // Handels click to show markers on map
  const handleMarkerClick = (id, lat, lng, name, number, address, capacity) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, name, number, address, capacity });
    setIsOpen(true);
  };

  // Changes pagination page
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Controlled form changes state for searchterm
  const handleSearchChange = (event) => setSearch(event.target.value);

  // Searches stations from params and sets state for rerender
  const searchStations = (event) => {
    event.preventDefault();
    const filteredStations = stations.filter((obj) =>
      JSON.stringify(obj).toLowerCase().includes(search.toLowerCase())
    );
    setSearchedStations(filteredStations);
    setCurrentPage(0);
  };

  // Clears search and sets state for rerender of all stations
  const clearSearch = () => {
    setSearchedStations(undefined);
    setSearch('');
  };

  const googleMap = isLoaded ? (
    <GoogleMap
      mapContainerClassName="map-container"
      onLoad={onMapLoad}
      onClick={() => setIsOpen(false)}
    >
      {markers.map(({ lat, lng, name, number, address, capacity }, ind) => (
        <Marker
          key={ind}
          position={{ lat, lng }}
          icon={customMarkerIcon}
          onClick={() => {
            handleMarkerClick(ind, lat, lng, name, number, address, capacity);
          }}
        >
          {isOpen && infoWindowData?.id === ind && (
            <InfoWindow
              onCloseClick={() => {
                setIsOpen(false);
              }}
            >
              <div>
                <h3>
                  {infoWindowData.number}&nbsp;-&nbsp;
                  {infoWindowData.name}
                </h3>
                <p>
                  {infoWindowData.address}
                  <br />
                  <em>
                    Capacity:&nbsp;{infoWindowData.capacity}
                    &nbsp;bikes
                  </em>
                </p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  ) : (
    <div className="loader"></div>
  );

  return (
    <div>
      <h2>Stations</h2>
      {googleMap}
      <div>
        <div>
          <form onSubmit={searchStations}>
            <input
              id="stationsearch"
              value={search}
              onChange={handleSearchChange}
            />
            <button id="stationsearchbutton" type="submit">
              Search
            </button>
          </form>
          <button onClick={clearSearch}>Clear search</button>
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
        forcePage={currentPage}
        pageCount={stationsToView.pageCount}
        pageClassName={'item pagination-page '}
        pageRangeDisplayed={2}
        previousClassName={'item previous'}
        previousLabel={'< back'}
      />
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th className="align-left">Name</th>
            <th className="align-left">Address</th>
            <th>City</th>
            <th>Capacity</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {stationsToView.items.map((s) => (
            <tr key={s.id}>
              <td>{s.number}</td>
              <td className="align-left">{s.nimi}</td>
              <td className="align-left">{s.osoite}</td>
              <td>{s.kaupunki}</td>
              <td>{s.capacity}</td>
              <td>
                <Link to={`/station/${s.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

StationList.propTypes = {
  stations: PropTypes.array,
};

export default StationList;
