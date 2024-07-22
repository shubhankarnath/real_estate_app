import React, { useState } from 'react';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {GoogleMap, useLoadScript, Marker} from '@react-google-maps/api'
import Map from "../component/GoogleMap"

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles]  = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading , setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageURLs : [],
    name : "",
    description : "",
    address : "",
    sell : 0,
    rent : 0,
    type : "rent",
    parking : 0,
    furnished : 0, 
    regularPrice : 100,
    discountPrice :100,
    bedrooms : 1,
    bathrooms : 1,
    location : {
      type : "Point", 
      coordinates :[0, 0]
    }
  })
  const [location, setLocation] = useState({ lat: -34.397, lng: 150.644 });
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // console.log(files); 
  console.log(error); 
  console.log(formData);

  const handleImageUpload = (e) =>{
     
      if(files.length > 0 && files.length + formData.imageURLs.length <7){
        setUploading(true);
        setImageUploadError(false);
        // console.log(file[i]);
        const promises = [];

        for(let i=0; i<files.length; i++){
            
            promises.push(uploadImage(files[i]))
            // console.log(promises[i]);
        }

        // console.log(promises);

        // for(let i=0; i<promises.size(); i++){    //not working
        //   setFormData({...formData, imageURLs : formData.imageURLs.concat(urls)});
        // }
        Promise.all(promises).then((urls)=>{
          setFormData({...formData, imageURLs : formData.imageURLs.concat(urls)});
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err)=>{
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        })

      }else{
        setImageUploadError("number of images should be less than 7.");
          setUploading(false);
      }
  }

  const uploadImage = async (file) =>{

    return new Promise((resolve, reject) =>{
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        (snapshot) =>{
            const progress = 
                  (snapshot.bytesTransferred/ snapshot.totalBytes)*100;
            console.log("image uploading ", progress, "% done");
        },
  
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          {
            resolve(downloadURL);
          }
          );
        }
      );
  
    })

  }

  const handleChange = (e) =>{

    if(e.target.id == 'sell' || e.target.id == 'rent'){
      setFormData({
        ...formData,
        type : e.target.id
      })
    }
    
    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
        setFormData({
          ...formData,
          [e.target.id] : e.target.checked,
        })
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    // console.log(formData);
  }
  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(formData.imageURLs.length > 0){
      try {
        // if (formData.imageURLs.length < 1){
        //    setError('You must upload at least one image');
        //     return
        // }
        setLoading(true);
        setError(false);
        // setFormData({...formData, userRef : currentUser.id})
        const res = await fetch(`${backendUrl}/api/listing/create`, {
          method : "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...formData,
            userRef : currentUser._id}),
        })

        const data = await res.json();
 
        if(data.success == false){
          setError(data.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        setError(false);
        navigate(
          `/listing/${data._id}`
        )

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }

    }else{
      setError('upload atleast 1 image');
    }

  }

  const handleAddressUpload = async(e) =>{
    // console.log("handleAddressUpload called");
    
    try {
      const address = formData.address;
      console.log("address is ",address);
      console.log(import.meta.env.VITE_GOOGLE_MAP_API_KEY)
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}`)
      const data = await response.json();
      console.log(data);

      if(data.status == 'OK'){
        const latitude = data.results[0].geometry.location.lat;
        const longitude = data.results[0].geometry.location.lng;

        console.log(latitude, longitude);

        formData.location.coordinates[0] = latitude;
        formData.location.coordinates[1] = longitude;

        setLocation({
          lat: latitude, 
          lng: longitude
        })
        console.log(location);

        console.log("formData.location.coordinates[0]", formData.location.coordinates[0]);
        console.log("formData.location.coordinates[1]", formData.location.coordinates[1]);
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div onChange={handleChange} className='flex flex-col gap-4 flex-1'>
          <input
            type='text' placeholder='Name' className='border p-3 rounded-lg' id='name'
            required
            value = {formData.name}
          />
          <textarea  onChange={handleChange} 
            type='text' placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            value = {formData.description}
          />
          <input  onChange={handleChange} 
            type='text' placeholder='Address' className='border p-3 rounded-lg' id='address'
            required
            value = {formData.address}
          />
          <button type = "button" onClick={handleAddressUpload} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              Find
              {/* {finding ? 'Uploading' : 'Upload'} */}
            </button>
          <div className='flex gap-6 flex-wrap'>  {/*for chekboxes */}
            <div  onChange={handleChange}  className='flex gap-2'>
              <input type='checkbox' id='sell' className='w-5'
              value ={formData.sell} checked={formData.type === 'sell'}/>
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input  onChange={handleChange}  type='checkbox' id='rent' className='w-5'
              value  = {formData.rent} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input  onChange={(e) => handleChange}  type='checkbox' id='parking' className='w-5' 
              value={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input  onChange={(e) => handleChange}  type='checkbox' id='furnished' className='w-5'
              value = {formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input  onChange={(e) => handleChange}  type='checkbox' id='offer' className='w-5' 
              value = {formData.offer}/>
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'> {/*for inputs which require numbers */}
            <div className='flex items-center gap-2'>
              <input  onChange={(e) => handleChange}  type='number' id='bedrooms' required
                className='p-3 border border-gray-300 rounded-lg'
                value = {formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input  onChange={(e) => handleChange}  type='number' id='bathrooms' min='1' max='10' required
                className='p-3 border border-gray-300 rounded-lg'
                value = {formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input onChange={(e) => handleChange} 
                type='number'
                id='regularPrice'
                required
                className='p-3 border border-gray-300 rounded-lg'
                value = {formData.regularPrice}

              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input onChange={(e) => handleChange} 
                type='number'
                id='discountPrice'
                required
                className='p-3 border border-gray-300 rounded-lg'
                value = {formData.discountPrice}

              />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>($ / month)</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
        <Map location ={location}></Map>
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple 
            />
            <button disabled={uploading} type = "button" onClick={handleImageUpload} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading' : 'Upload'}
            </button>
          </div>
          <p className='text-red-800 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageURLs.length > 0 &&
            formData.imageURLs.map((url, index) => (
              <div
                key={url}
                className=' p-3 border self-center' >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
              </div>
            ))}        
            <button disabled = {loading ||uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
            >
              {loading ? "creating..." : "Create Listing"}</button>

              <p className='text-red-700 text-sm'>
            {error && error}
          </p>
        </div>
        
      </form>
              
    </main>
  );
}
