import React from 'react'
import HotelCard from './HotelCard'
import { roomsDummyData } from '../assets/assets'
import Title from './title'
import { useNavigate } from 'react-router-dom'


const FeaturedDestination = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center bg-slate-50 px-3 md:px-9 lg:px-12 py-15'>
        <Title title='Featured Destinations' subtitle='Explore our top handpicked selections of exceptional properties around the country, offering unparalleled comfort, luxury, and authentic experiences.' />
        <div className='flex flex-wrap items-center justify-center px-6 md:px-16 lg:px-16 lg:px-24 bg-slate-50 py-15 pb-5 gap-7'>
            {roomsDummyData.slice(0, 4).map((room, index) => (
                <HotelCard key={room._id} room={room} index={index} />
            ))}
        </div>

        <button 
        onClick={()=>{navigate('/rooms'); window.scrollTo(0,0)}}
        className='my-16 px-4 py-2 text-sm font-medium border border-grey-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
          View All Destination
        </button>
    </div>
  )
}

export default FeaturedDestination