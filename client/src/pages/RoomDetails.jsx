import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData, roomsDummyData } from '../assets/assets'
import StarRating from '../components/StarRating'

const RoomDetails = () => {
    const { id } = useParams()
    const [{ room, mainImage }, setRoomData] = useState({ room: null, mainImage: null })

    useEffect(() => {
        const foundRoom = roomsDummyData.find((room) => room._id === id)
        if (foundRoom) {
            setRoomData({ room: foundRoom, mainImage: foundRoom.images[0] })
        }
    }, [id])

    const handleImageClick = (image) => {
        setRoomData((prev) => ({ ...prev, mainImage: image }))
    }

    return room && (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>

            {/* Room details */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>
                    {room.hotel.name} <span className='font-normal text-sm'>({room.roomType})</span>
                </h1>
                <p className='text-xl font-medium px-3 py-1 rounded-full bg-orange-500 text-white'>20% OFF</p>
            </div>

            {/* Room rating */}
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
            </div>

            {/* Room address */}
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
            </div>

            {/* Room images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img src={mainImage} alt="room-image" className='w-full rounded-xl shadow-lg object-cover' />
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room.images.length > 1 && room.images.map((image, index) => (
                        <img
                            key={index}
                            onClick={() => handleImageClick(image)}
                            src={image}
                            alt="room-image"
                            className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image ? 'outline outline-3 outline-orange-500' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Room facilities */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl font-playfair md:text-4xl'>Experience Luxury Like Never Before</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <img className='w-5 h-5' src={facilityIcons[item]} alt={item} />
                                <p className='text-sm'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Room price */}
                <div className='flex flex-col'>
                    <p className='text-2xl font-medium text-gray-700'>৳{room.pricePerNight}/night</p>
                    <div className='flex items-center gap-1 mt-2'>
                        <StarRating />
                        <p className='text-gray-500'>200+ reviews</p>
                    </div>
                </div>
            </div>

            {/* Check-in / Check-out form */}
            <form className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center md:gap-10 text-gray-500 gap-4'>

                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium'>Check-in</label>
                        <input type="date" id='checkInDate' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    <div className='flex flex-col'>
                        <label htmlFor="checkOutDate" className='font-medium'>Check-out</label>
                        <input type="date" id='checkOutDate' className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    <div className='flex flex-col'>
                        <label htmlFor="guests" className='font-medium'>Guests</label>
                        <input type="number" id='guests' placeholder='0' max={4} min={1} className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>

                </div>
                <button type='submit' className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'>
                    Check Availability
                </button>
            </form>

            {/* Room specifications */}
            <div className='mt-25 space-y-4'>
                {roomCommonData.map((spec, index) => (
                    <div key={index} className='flex items-start gap-2'>
                        <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5' />
                        <div>
                            <p className='text-base'>{spec.title}</p>
                            <p className='text-gray-500'>{spec.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                <p>Guest will be allocated on the ground floor according to availability. You get a comfortable two bedroom apartment has a true city feelings. The price quoted is for two guests, at the guest slot please mark the number of guests to get the exact price for the group. The guests will be allocated ground floor according to availability. You will get comfortable two bedroom apartment that has a true city feelings.</p>
            </div>

            <button className='px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull active:scale-95 transition-all cursor-pointer'>
                Contact Now
            </button>

            {/* Location on Map */}
            <div className='mt-20'>
                <h2 className='text-3xl font-playfair mb-1'>Location on Map</h2>
                <div className='flex items-center gap-1 text-gray-500 mb-6'>
                    <img src={assets.locationIcon} alt="location-icon" />
                    <span>{room.hotel.address}</span>
                </div>

                <div className='relative w-full rounded-2xl overflow-hidden shadow-[0px_0px_20px_rgba(0,0,0,0.12)]' style={{ height: '420px' }}>
                    <iframe
                        title='Hotel Location'
                        width='100%'
                        height='100%'
                        style={{ border: 0 }}
                        loading='lazy'
                        allowFullScreen
                        referrerPolicy='no-referrer-when-downgrade'
                        src={`https://www.google.com/maps?q=${encodeURIComponent(room.hotel.address)}&output=embed`}
                    />
                </div>

                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.hotel.address)}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 mt-4 text-primary hover:text-primary-dull font-medium transition-colors'
                >
                    <img src={assets.locationIcon} alt="" className='w-4 h-4' />
                    View larger map
                    <svg xmlns="http://www.w3.org/2000/svg" className='w-4 h-4' viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </a>
            </div>

        </div>
    )
}

export default RoomDetails