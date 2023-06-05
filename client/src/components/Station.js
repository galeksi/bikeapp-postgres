import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import stationService from '../services/stations';

import '../styles/Station.css';
import '../styles/map.css';
import customMarkerIcon from '../assets/Map_marker_blue.png';

const Station = ({ stations }) => {
  const [station, setStation] = useState();
  const id = useParams().id;

  useEffect(() => {
    const fetchStationData = async () => {
      const station = stations.find((s) => s.id === Number(id));
      const statistics = await stationService.getStats(id);

      station.stats = statistics;
      station.returnStations = statistics.popularReturn.map((ret) =>
        stations.find((s) => s.id === Number(ret))
      );
      station.departureStations = statistics.popularDeparture.map((dep) =>
        stations.find((s) => s.id === Number(dep))
      );
      station.center = { lat: Number(station.lat), lng: Number(station.long) };

      setStation(station);
    };

    fetchStationData();
  }, []);

  // Loads google API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });

  if (!station) {
    return (
      <>
        <h1>Station...</h1>
        <div className="loader"></div>;
      </>
    );
  }

  const googleMap = isLoaded ? (
    <GoogleMap
      mapContainerClassName="map-container-station"
      center={station.center}
      zoom={15}
    >
      <Marker position={station.center} icon={customMarkerIcon} />
    </GoogleMap>
  ) : (
    <h1>Loading...</h1>
  );

  return (
    <div>
      <h1>
        Station Nr {station.number}: {station.nimi}
      </h1>
      <div className="station-container">
        <div className="station-map">{googleMap}</div>
        <div className="station-data">
          <h3>
            {station.osoite}&nbsp;{station.kaupunki}
          </h3>
          <p>
            <em>Capacity:</em>
            <br />
            {station.capacity}&nbsp;bikes
          </p>
          <p>
            <em>Departures from station:</em>
            <br />
            {station.stats.startTotal}
          </p>
          <p>
            <em>Returns to station:</em>
            <br />
            {station.stats.returnTotal}
          </p>
          <p>
            <em>Average distance for departure:</em>
            <br />
            {station.stats.startAvg}
            &nbsp;km
          </p>
          <p>
            <em>Average distance for return:</em>
            <br />
            {station.stats.returnAvg}
            &nbsp;km
          </p>
        </div>
      </div>
      <div className="station-container">
        <div className="station-stats">
          <h2>Popular return stations:</h2>
          <ol>
            {station.returnStations.map((s) => (
              <li key={s.id}>
                <em>
                  <a href={`/station/${s.id}`}>{s.nimi}</a>
                  &nbsp;(Nr.{s.number})
                </em>
                <br />
                {s.osoite}
              </li>
            ))}
          </ol>
        </div>
        <div className="station-stats">
          <h2>Popular departure stations:</h2>
          <ol>
            {station.departureStations.map((s) => (
              <li key={s.id}>
                <em>
                  <a href={`/station/${s.id}`}>{s.nimi}</a>
                  &nbsp;(Nr.{s.number})
                </em>
                <br />
                {s.osoite}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

Station.propTypes = {
  stations: PropTypes.array,
};

export default Station;
