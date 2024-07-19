import React, {useEffect, useState, useRef} from 'react';
import {GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import AutocompleteComponent from './AutoComplete';
const containerStyle = {
  width: '400px',
  height: '400px'
};

const initialcenter = {
  lat: 28.5005141,
  lng: 77.381967
};

function MyComponent({location}) {

  console.log("MyComponent,", location)
  const [center, setCenter] = useState(location);

  const onMarkerDragEnd = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setCenter({ lat, lng });
  };

  console.log("location im map ", location)

  useEffect(()=>{
    setCenter(location)
  }
  , [location])
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}

    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        // onLoad={map => mapRef.current = map}
      >
        { /* Child components, like markers or shapes */ }
        <Marker position={center} 
          draggable = {true}
          onDragEnd={onMarkerDragEnd}/>

      </GoogleMap>
      {/* <AutocompleteComponent></AutocompleteComponent> */}
    </LoadScript>

  )
}

export default React.memo(MyComponent);


