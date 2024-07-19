// ParentComponent.js
import React, {useState, useEffect} from 'react';
import MyComponent from './GoogleMap2';

const ParentComponent = () => {
    const [locations, setLocations] = useState(null);

    useEffect(() => {
      // Simulate an API call to fetch locations
        setLocations([
          { lat: 28.5005141, lng: 77.381967 },
          { lat: 22.704060, lng: 77.102493 },
          { lat: 28.459497, lng: 77.026634 }
        ]);
    }, []);

    console.log("location on CT, ", locations)

  return (
    <div>
      <h1>Google Maps with Multiple Markers</h1>
      {/* <MyComponent location={locations} /> */}
      <MyComponent location={locations}></MyComponent>
    </div>
  );
};

export default ParentComponent;
