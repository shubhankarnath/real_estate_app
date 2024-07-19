import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [getLandlordError, setGetLandlordError] = useState(null);
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setGetLandlordError(false);
        if(!listing) return;
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();

        if(data.success == false){
          setGetLandlordError(data.message);
          return;
        }
        setLandlord(data);
        console.log(landlord);
      } catch (error) {
        // console.log(error);
        setGetLandlordError(error.message);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  
  return (
    <>
      {getLandlordError && (
        <span className='text-red-700'>
          {getLandlordError};
        </span>
      )}
      {landlord && (
        <div className='flex flex-col gap-2 my-4'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}
