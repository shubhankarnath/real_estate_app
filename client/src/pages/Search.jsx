import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingCard from '../component/ListingCard';
import MapComponentMulitpleMarker from '../component/GoogleMap2';
import { list } from 'firebase/storage';


export default function Search() {

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [locations, setLocations] = useState(null);

  useEffect(() => {                         // need to remove before commit
    // Simulate an API call to fetch locations
    setLocations([
      { lat: 28.5005141, lng: 77.381967 },
      { lat: 22.704060, lng: 77.102493 },
      { lat: 28.459497, lng: 77.026634 }
    ]);
  }, []);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    searchTerm: '',
    type: 'all',
    offer: false,
    parking: false,
    furnished: false,
    sort: 'createdAt',
    order: 'desc',
    applyGeoFilter: false,
    radiusInKilometer: 10,

  });

  // console.log(formData);
  // console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    // console.log(urlParams);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type')
    const offerFromUrl = urlParams.get('offer')
    const parkingFromUrl = urlParams.get('parking')
    const furnishedFromUrl = urlParams.get('furnished')
    const sortFromUrl = urlParams.get('sort')
    const orderFromUrl = urlParams.get('order')
    const radiusInKilometerFromUrl = urlParams.get('radiusInKilometer')

    console.log(offer);
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      radiusInKilometerFromUrl
    ) {
      setFormData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        offer: offerFromUrl === 'true' ? true : false,
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'createdAt',
        order: orderFromUrl || 'desc',
        radiusInKilometer: radiusInKilometerFromUrl || 10
      })
    }

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);
        setShowMore(false);

        // const urlParams = new URLSearchParams();   // DONT NEED TO DO THIS.
        // for (const key in formData) {
        //   if (formData.hasOwnProperty(key)) {
        //     // console.log(key);
        //     urlParams.set(key, formData[key]);
        //   }
        // }
        const searchQuery = urlParams.toString();

        const res = await fetch(`/api/listing/get?${searchQuery}`);

        const data = await res.json();
        // console.log("listings ", data)


        if (data.success === false) {
          console.log(data.message);
          setLoading(false);
          setError(data.message);
          return;
        }

        if (data.length > 8) {
          setShowMore(true);  
        } else {
          setShowMore(false);
        }

        
        setListings(data);

        // setListings(data);
        setLoading(false);
        // console.log(data);


      } catch (error) {
        setLoading(false);
        setError(true);
      }
    }
    fetchListing();


  }, [location.search])

  useEffect(() => {
    if (listings.length > 0) {
      const newLocation = listings
        .filter(listing => listing.location && listing.location.coordinates)
        .map((listing)=>{
        // console.log("my listings", listing)
        if(listing.location){
          // console.log("listing.location", listing.location)
          let lat = listing.location.coordinates[0];
          let lng=listing.location.coordinates[1];
          return {lat,lng};
        }
        
      }); 
      // console.log("newLocation", newLocation);
      setLocations(newLocation)
    } 
  }, [listings])

  const handleChange = (e) => {
    if (e.target.id == 'searchTerm') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value
      })
    }
    if (e.target.id == 'sell' || e.target.id == 'rent' || e.target.id == 'all') {
      setFormData({
        ...formData,
        type: e.target.id
      })
    }
    if (e.target.id == "radiusInKm") {
      setFormData({
        ...formData,
        radiusInKilometer: e.target.value
      })
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
      })
    }

    // console.log(e.target.value);
    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order = e.target.value.split('_')[1] || 'desc';

      setFormData({ ...formData, sort, order });
    }


  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    // console.log(searchParams);
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', formData.searchTerm);
    urlParams.set('type', formData.type);
    urlParams.set('parking', formData.parking);
    urlParams.set('furnished', formData.furnished);
    urlParams.set('offer', formData.offer);
    urlParams.set('sort', formData.sort);
    urlParams.set('order', formData.order);
    urlParams.set('radiusInKilometer', formData.radiusInKilometer)

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  const handleShowMore = async (e) => {
    e.preventDefault();
    try {
      const urlParams = new URLSearchParams(location.search);

      urlParams.set(
        'startIndex', listings.length
      )

      const searchQuery = urlParams.toString();

      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      // console.log(data);
      if (data.success === false) {
        console.log(data.message);
        return;
      }



      if (data.length < 9) {
        setShowMore(false);
      }

      setListings([...listings, ...data]);
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSearchSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Location:</label>
            <input
              onChange={handleChange}
              type='text' id='searchTerm' placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={formData.searchTerm}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Within Area in Km:</label>
            <input
              onChange={handleChange}
              type='text' id='radiusInKm' placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={formData.radiusInKilometer}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>
            <div className='flex gap-2'>

              <input onChange={handleChange} checked={formData.type === 'all'} type='checkbox' id='all' className='w-5' />
              <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>

              <input type='checkbox' id='rent' className='w-5'
                onChange={handleChange} checked={formData.type === 'rent'} />

              <span>Rent</span>
            </div>
            <div className='flex gap-2'>

              <input type='checkbox' id='sell' className='w-5'
                onChange={handleChange} checked={formData.type === 'sell'} />
              <span>Sell</span>

            </div>
            <div className='flex gap-2'>

              <input type='checkbox' id='offer' className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />

              <span>Offer</span>
            </div>
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Amenities:</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5'
                onChange={handleChange}
                checked={formData.parking} />

              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5'
                onChange={handleChange}
                checked={formData.furnished} />

              <span>Furnished</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <select id='sort_order' className='border rounded-lg p-3'
              onChange={handleChange}
              defaultValue={'createdAt_desc'}

            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to hight</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Search
          </button>
          <MapComponentMulitpleMarker
         location={locations}></MapComponentMulitpleMarker>
        </form>
        
      </div>
      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
          Listing results:
        </h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-slate-700'>No listing found!</p>
          )}
          {loading && (
            <p className='text-xl text-slate-700 text-center w-full'>
              Loading...
            </p>
          )}
          {!loading &&
            listings &&

            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>

        {showMore && (
          <button onClick={handleShowMore}
            className='text-green-600 p-4 hover:underline'>Show More</button>
        )}
      </div>
    </div>
  );
}