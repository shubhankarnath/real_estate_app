import React, { useEffect, useState } from 'react'
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import {FaSearch} from 'react-icons/fa'
import {useSelector} from 'react-redux';

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');

    // console.log(searchTerm);
    const {currentUser} = useSelector(state => state.user);
    const navigate = useNavigate();

    const handleSearchSubmit = (e)  => {
        e.preventDefault();
            // console.log(searchParams);
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('searchTerm', searchTerm);

            const searchQuery = urlParams.toString();

            navigate( `/search?${searchQuery}`);

    }

    useEffect(() =>{
        try {
            const urlParams = new URLSearchParams(window.location.search);

            const searchTermFromUrl = urlParams.get('searchTerm');
            // console.log(searchTermFromUrl);
            if(searchTermFromUrl){
                setSearchTerm(searchTermFromUrl);
            }
        } catch (error) {
            
        }
    }, [window.location.search])
  return (
    <header className='bg-slate-200 shadow-md '>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'> 

            <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-500'>Pro</span>
                    <span className='text-slate-700'>Real</span>
                    <span className='text-slate-500'>Estate</span>
                </h1>
            </Link>     

            <form onSubmit={handleSearchSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder='Search...' 
                className='bg-transparent focus:outline-none w-24 sm:w-64'
                value = {searchTerm}
                />
                <button>
                <FaSearch className = "text-slate-600"></FaSearch>
                </button>
            </form>

            <ul className='flex gap-4  text-slate-500'>
                <Link to='/'>
                    <li className='hidden sm:inline hover:underline'>Home</li>
                </Link>
                
                <Link to='/about'>
                    <li className='hidden sm:inline hover:underline'>About</li>
                </Link>

                <Link to='/profile'>
                    {currentUser ? (
                    <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
                    ) : (
                    <li className=' text-slate-500  hover:underline'> Sign in</li>
                    )}                
                </Link>
                
            </ul>


        </div>

    </header>
  )
}
