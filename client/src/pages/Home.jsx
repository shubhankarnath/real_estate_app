import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules'
import ListingCard from '../component/ListingCard';

export default function Home() {

  const [offerListing, setOfferListing] = useState(false);
  const [rentListing, setRentListing] = useState(false);
  const [sellListing, setSellListing] = useState(false);

  // console.log(offerListing);
  SwiperCore.use([Navigation]);

    const imageUrls = [
      'https://firebasestorage.googleapis.com/v0/b/mern-estate-51671.appspot.com/o/1698405608661Screenshot%202023-10-27%20164839.png?alt=media&token=11104904-71bd-4ec0-a094-040fd067790b'
    , 'https://firebasestorage.googleapis.com/v0/b/mern-estate-51671.appspot.com/o/1698414126789Screenshot%202023-10-27%20184900.png?alt=media&token=a3250d6c-47de-40db-b4e6-e77725b20627',
  'https://firebasestorage.googleapis.com/v0/b/mern-estate-51671.appspot.com/o/1698414126791Screenshot%202023-10-27%20184913.png?alt=media&token=2014aac4-3875-4d1b-9485-66157d57ef3f',
'https://firebasestorage.googleapis.com/v0/b/mern-estate-51671.appspot.com/o/1698414007034Screenshot%202023-10-27%20184932.png?alt=media&token=74c5438e-7dd1-4e5b-abbc-2ff21324ed90']

useEffect(() =>{
    const fetchOfferListing = async()=>{
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=3`);
        const data = await res.json();

        if(data.success === false){
          console.log(data.message);
          return;
        }
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error.message);
      }
    }
    const fetchRentListing = async() =>{
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=3`);
        const data = await res.json();

        if(data.success === false){
          console.log(data.message);
          return;
        }
        setRentListing(data);
        fetchSellListing();
      } catch (error) {
        console.log(error.message);
      }

    }

    const fetchSellListing = async() =>{
      try {
        const res = await fetch(`/api/listing/get?type=sell&limit=3`);
        const data = await res.json();

        if(data.success === false){
          console.log(data.message);
          return;
        }
        setSellListing(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchOfferListing();
}, [])

  return (
    <main>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
        Find a home you'll <span className='text-slate-500'>love</span>
          <br />
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm'>
          Pro Real Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to={'/search'}
          className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

      {/* middle slider */}
      <Swiper navigation>
            {imageUrls && imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  
                ></div>
                {/* <img className='w-full h-[60vh]' src={url} alt="" /> */}
              </SwiperSlide>
            ))}
        </Swiper>




      {/* listings with type*/}
        

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListing && offerListing.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold stext-slate-600'>Recent places for offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}
              >Show more places for offers
              </Link>
          </div>

            <div className='p-7 flex flex-wrap gap-4'>
            {
                offerListing.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))
              }
            </div>
          </div>
        )}
      
        {rentListing && rentListing.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}
              >Show more places for rent
              </Link>
          </div>

            <div className='p-7 flex flex-wrap gap-4'>
            {
                rentListing.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))
              }
            </div>
          </div>
        )}

        {sellListing && sellListing.length > 0 && (
          <div>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sell</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sell'}
              >Show more places for sell
              </Link>
          </div>

            <div className='p-10 flex flex-wrap gap-5'>
            {
                sellListing.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))
              }
            </div>
          </div>
        )}
      </div>
      
    </main>
  )
}
