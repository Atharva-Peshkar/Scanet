import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import * as parkDate from "./skateboard-parks.json";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import "./Doctor.scss";
import doctorImage from "./assets/doctor.png";

export default function Doctor() {
  const [viewport, setViewport] = useState({
    latitude: 21.11094750780796,
    longitude: 79.06984464603627,
    width: "70vw",
    height: "75vh",
    zoom: 12.6,
  });
  const [selectedPark, setSelectedPark] = useState(null);

  const goToNYC = (long, lati) => {
    setViewport({
      ...viewport,
      longitude: long,
      latitude: lati,
      zoom: 15,
      transitionDuration: 5000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  useEffect(() => {
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <div className="doctor">
      <div className="menuContainer">
        {parkDate.features.map((hosp) => (
          <div
            onClick={() => {
              goToNYC(
                hosp.geometry.coordinates[0],
                hosp.geometry.coordinates[1]
              );
            }}
            key={hosp.properties.NAME}
            className="hospitalContainer"
          >
            <p className="mainText">{hosp.properties.NAME}</p>
            <p>{hosp.properties.DESCRIPTIO}</p>
          </div>
        ))}
      </div>
      <ReactMapGL
        className="mapMap"
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1IjoiYW5pa2V0czA4IiwiYSI6ImNrc29hY2NtdDAyd3AydXM2dnp5MGlsYWYifQ.qA7LrPKGWxDjbDs0-YXT_A"
        // mapStyle="mapbox://styles/anikets08/ckskdoxfk0sfz17qdg35s5usl"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {parkDate.features.map((park) => (
          <Marker
            key={park.properties.PARK_ID}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
          >
            <div
              className="marker-btn"
              onClick={(e) => {
                e.preventDefault();
                setSelectedPark(park);
              }}
            >
              <img src={doctorImage} width="70px" />
            </div>
          </Marker>
        ))}

        {selectedPark ? (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div>
              <h2>{selectedPark.properties.NAME}</h2>
              <p>{selectedPark.properties.DESCRIPTIO}</p>
            </div>
          </Popup>
        ) : null}
        {/* <button onClick={goToNYC}>Click</button> */}
      </ReactMapGL>
    </div>
  );
}
