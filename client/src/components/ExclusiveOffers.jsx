import React from 'react'
import { assets, exclusiveOffers } from '../assets/assets'
import Title from './title'

const ExclusiveOffers = () => {
    
  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-31 pt-15 pb-30'>
        <div className='flex flex-col md:flex-row items-center justify-between w-full'>
            <Title
            align='left' 
            title='Exclusive Offers' subtitle='Explore our top handpicked selections of exceptional properties around the country, offering unparalleled comfort, luxury, and authentic experiences.'/>
            <button className='group flex items-center gap-2 font-medium cursor-pointer max-md:mt-10'>
                View All Offers
                <img src={assets.arrowIcon} alt="arrow icon" 
                className='group-hover:translate-x-1 transition-all'
                />
            </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12'>
            {exclusiveOffers.map((items) => (
            <div key={items._id} className='group relative flex flex-col items-start justify-between gap-1 pt-12 md:pt-18 px-4 rounded-xl text-white bg-no-repeat bg-cover bg-center' style={{backgroundImage: `url(${items.image})`}}>
                <p className='px-3 py-1 absolute top-4 left-4 text-xs bg-white text-gray-800 font-medium rounded-full'>{items.priceOff}$ OFF</p>
                <div>
                    <p className='text-2xl font-medium font-playfair'>{items.title}</p>
                    <p>{items.description}</p>
                    <p className='text-xs text-white/70 mt-3'>{items.expiryDate}</p>
                </div>
                <button className='flex items-center gap-2 font-medium cursor-pointer mt-4 mb-5'>
                    View Offer
                    <img className='invert group-hover:translate-x-1 transition-all' src={assets.arrowIcon} alt="arrow icon" />
                </button>
            </div>
            ))}
        </div>
    </div>
  )
}

export default ExclusiveOffers