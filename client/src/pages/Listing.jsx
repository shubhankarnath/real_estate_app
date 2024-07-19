import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import Map from '../component/GoogleMap'
// import {SliderWrap} from "./swiper.style";

import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import Contact from '../component/Contact';
// import 'swiper/swiper-bundle.css';


// console.log(error);

export default function Listing() {
SwiperCore.use([Navigation]);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [hide, setHide] = useState(false);
    const [contact, setContact] = useState(false);
    const [contactForm, setContactForm] = useState(false);  
    const { currentUser } = useSelector((state) => state.user);  
    const params = useParams();
    const [location, setLocation] = useState({ lat: -34.397, lng: 150.644 });


    // console.log(listing);
    // console.log(error);
    // console.log(loading);

    useEffect(() =>{
        const fetchListing =async () =>{
            
            try {
                setLoading(true);
                setError(false);
                setListing(null);

                const listingId = params.listingId;
                // console.log(listingId);;
    
                const res = await fetch(`/api/listing/get/${listingId}`);
    
                const data = await res.json();
              
                console.log(data);
                if(data.success == false){
                    console.log(data.message);
                    setError(data.message);
                    setLoading(false);
                    return;
                }

                setLoading(false);
                setListing(data);
                setError(false);

                if(data.location){
                  setLocation({
                    lat: data.location.coordinates[0], 
                    lng: data.location.coordinates[1], 
                  })
                }
                
                // console.log(location)
            } catch (error) {
                setLoading(false);
                setError(error.message);
            }

            // console.log(data);

            // setFormData(data);  
        }

        fetchListing();
    }, [params.listingId]) // means when listinId is changed this useEffect will execute.

  return (
    <main>
        {loading && <p className= 'text-center my-4 text-2xl'>loading...</p>}
        {error && <p className= 'text-center text-red-500 my-4 text-2xl'>error Happened:   {error}</p>}

        {listing && !error && !loading &&
        (
            
        <div className="">
          <Swiper navigation>
            {listing.imageURLs.map((url) => (
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
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
               navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 1000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}

          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
          {listing.location && (
            <Map location = {location}></Map>
          )
          }
          
            <p className='text-2xl font-semibold'>
              {listing.name} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sell'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listing.regularPrice - +listing.discountPrice} Discount
                </p>
              )}    
            </div>
            <p className='text-slate-800 text-base'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            {(currentUser && currentUser._id !== listing.userRef ) &&
            (
            <div>
                <button hidden= {contact} onClick={()=>{
                    setContact(true);
                }} className='w-full bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
               >
                contact landLord    
        </button>
        

        {contact && (
            <Contact listing = {listing}/>
        )}

            </div>

            
            )
          }
          
          </div>

          
          
        </div>



          

        )
          
        }        


    </main>
  )
}
