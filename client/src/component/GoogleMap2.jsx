// MyComponent.js
import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const initialCenter = {
  lat: 28.5005141,
  lng: 77.381967
};

function MyComponent({ location }) {
    // console.log(location)
    // const [locations, setLocations] = useState(null);

    // location = locations;

    const [center, setCenter] = useState(initialCenter);
    const [markers, setMarkers] = useState([]);
    const mapRef = useRef(null)

    useEffect(() => {
        // console.log("location updated", location)
        if (location && location.length > 0) {
          // setCenter(location[0]); // assuming location is an array of coordinates
          setMarkers(location);
        }
    }, [location]);

    useEffect(()=>{
        if (markers.length > 0 && mapRef.current){
          // console.log("markers updated", markers)
            const bounds = new window.google.maps.LatLngBounds();
            markers.forEach(marker => {
              // console.log(marker)
              if(marker.lat && marker.lng)
                bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
            });
            mapRef.current.fitBounds(bounds);
        }

    }, [markers])

  const onMarkerDragEnd = (event, index) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newMarkers = [...markers];
    newMarkers[index] = { lat, lng };
    setMarkers(newMarkers);
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={map => (mapRef.current = map)}
        // fitBounds = {bounds}
      >
        {markers.map((l, index) => (
          <Marker
            key={index}
            position={l}
            draggable={true}
            onDragEnd={(event) => onMarkerDragEnd(event, index)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(MyComponent);
