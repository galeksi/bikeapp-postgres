import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from '@react-google-maps/api';
import ReactPaginate from 'react-paginate';
import { paginationLoader } from '../utils/helpers';

import '../styles/StationList.css';
import '../styles/map.css';
import '../styles/pagination.css';
import customMarkerIcon from '../assets/Map_marker_blue.png';

const StationList = ({ stations }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchedStations, setSearchedStations] = useState();
  const [search, setSearch] = useState('');
  const [markers, setMarkers] = useState([]);
  const [searchedMarkers, setSearchedMarkers] = useState();
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();

  const createMarkers = (stations) => {
    const markers = stations.map((s) => ({
      name: s.nimi,
      number: s.number,
      address: s.osoite,
      capacity: s.capacity,
      lat: Number(s.lat),
      lng: Number(s.long),
    }));

    return markers;
  };

  useEffect(() => {
    const newMarkers = createMarkers(stations);
    setMarkers(newMarkers);
  }, []);

  // Loads google API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });

  // Decides if all stations or search result is added for pagination and initial view
  const allStations = searchedStations ?? stations;
  const stationsToView = paginationLoader(allStations, currentPage, 20);

  const markersToView = searchedMarkers ?? markers;

  // Google maps markers location and info

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
    const filteredMarkers = createMarkers(filteredStations);

    setSearchedStations(filteredStations);
    setSearchedMarkers(filteredMarkers);
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
      {markersToView.map(
        ({ lat, lng, name, number, address, capacity }, ind) => (
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
        )
      )}
    </GoogleMap>
  ) : (
    <div className="loader"></div>
  );

  return (
    <div>
      <h1>Stations</h1>
      {googleMap}
      <div>
        <form className="station-search-bar" onSubmit={searchStations}>
          <input
            id="stationsearch"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            className="btn-primary-lg"
            id="stationsearchbutton"
            type="submit"
          >
            Search
          </button>
          <button className="btn-secondary-lg" onClick={clearSearch}>
            Clear
          </button>
        </form>
      </div>
      <ReactPaginate
        activeClassName={'item active '}
        breakClassName={'item break-me '}
        breakLabel={'...'}
        containerClassName={'pagination'}
        disabledClassName={'disabled-page'}
        marginPagesDisplayed={2}
        nextClassName={'item next '}
        nextLabel={'next >'}
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
            <th className="align-left">Name</th>
            <th className="align-left">Address</th>
            <th>Number</th>
            <th>City</th>
            <th>Capacity</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {stationsToView.items.map((s) => (
            <tr key={s.id}>
              <td className="align-left">{s.nimi}</td>
              <td className="align-left">{s.osoite}</td>
              <td>{s.number}</td>
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
