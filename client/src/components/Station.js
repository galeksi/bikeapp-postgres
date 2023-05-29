import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import stationService from '../services/stations';

import '../styles/map.css';

const Station = ({ stations }) => {
  const [station, setStation] = useState(undefined);
  const id = useParams().id;

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

  useEffect(() => {
    fetchStationData();
  }, []);

  // Loads google API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });

  if (!station) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>
        Station Nr {station.number}: {station.nimi}
      </h1>
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container-station"
          center={station.center}
          zoom={15}
        >
          <Marker position={station.center} />
        </GoogleMap>
      )}
      <div>
        <div>
          <h2>
            {station.osoite}&nbsp;{station.kaupunki}
          </h2>
          <p>
            <b>Capacity:</b>&nbsp;{station.capacity}&nbsp;bikes
          </p>
          <p>
            <b>Departures from station:</b>&nbsp;{station.stats.startTotal}
          </p>
          <p>
            <b>Returns to station:</b>&nbsp;{station.stats.returnTotal}
          </p>
          <p>
            <b>Average distance for departure:</b>&nbsp;{station.stats.startAvg}
            &nbsp;km
          </p>
          <p>
            <b>Average distance for return:</b>&nbsp;{station.stats.returnAvg}
            &nbsp;km
          </p>
        </div>
        <div>
          <h2>Most popular return stations:</h2>
          <ol>
            {station.returnStations.map((s) => (
              <li key={s.id}>
                <b>
                  {s.nimi}&nbsp;(Nr.{s.number})
                </b>
                &nbsp;-&nbsp;{s.osoite}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h2>Most popular departure stations:</h2>
          <ol>
            {station.departureStations.map((s) => (
              <li key={s.id}>
                <b>
                  {s.nimi}&nbsp;(Nr.{s.number})
                </b>
                &nbsp;-&nbsp;{s.osoite}
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
