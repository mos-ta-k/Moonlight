import React, { useState, useEffect } from 'react'
import Title from '../components/title'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const MyBookings = () => {
    const [bookings, setBookings] = useState([])
    const {axios, getToken, user} = useAppContext();

    const fetchUserBookings = async () => {
        try {
            const token = await getToken();
            const response = await axios.get('/api/bookings/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                
            });
            console.log("BOOKINGS RESPONSE:", response.data);
            setBookings(response.data.bookings);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(user){
            fetchUserBookings();
        }
    }, [user]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title="My Bookings" subtitle="Manage your bookings and reservations" align="left" />
            <div className='max-w-6xl mt-8 w-full text-gray-800'>

                {/* Table Header */}
                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                    <div>Hotels</div>
                    <div>Date & Timing</div>
                    <div>Payment</div>
                </div>

                {bookings.map((booking) => (
                    <div key={booking._id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t items-center'>

                        {/* Hotel Details */}
                        <div className='flex flex-col md:flex-row'>
                            <img
                                src={booking.room.images[0]}
                                alt="room-image"
                                className='w-full md:w-44 h-32 rounded shadow object-cover'
                            />
                            <div className='flex flex-col gap-1.5 max-md:mt-3 md:ml-4'>
                                <p className='font-playfair text-2xl'>
                                    {booking.hotel.name}
                                    <span className='text-sm font-inter'> ({booking.room.roomType})</span>
                                </p>
                                <div className='flex items-center gap-1 text-sm text-gray-500 mt-1'>
                                    <img src={assets.locationIcon} alt="location-icon" className='w-4 h-4' />
                                    <span>{booking.hotel.address}</span>
                                </div>
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.guestsIcon} alt="guest-icon" className='w-4 h-4' />
                                    <span>Guests: {booking.guests}</span>
                                </div>
                                <p className='text-base font-medium'>Total: ৳{booking.totalPrice}</p>
                            </div>
                        </div>

                        {/* Date & Timing */}
                        <div className='flex flex-col gap-1.5 mt-4 md:mt-0'>
                            <div className='flex items-center gap-2 text-sm text-gray-500'>
                                <img src={assets.calenderIcon} alt="calendar" className='w-4 h-4' />
                                <span>Check-In:</span>
                                <span className='text-gray-800 font-medium'>{formatDate(booking.checkInDate)}</span>
                            </div>
                            <div className='flex items-center gap-2 text-sm text-gray-500'>
                                <img src={assets.calenderIcon} alt="calendar" className='w-4 h-4' />
                                <span>Check-Out:</span>
                                <span className='text-gray-800 font-medium'>{formatDate(booking.checkOutDate)}</span>
                            </div>
                            <div className='text-sm text-gray-500 mt-1'>
                                Method: <span className='text-gray-800 font-medium'>{booking.paymentMethod}</span>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className='flex flex-col items-start justify-center pt-3'>
                            <div className='flex items-center gap-2'>
                                <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500" }`}></div>
                                <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500" }`}>
                                    {booking.isPaid ? "Paid" : "Not Paid"}
                                </p>
                            </div>
                            {!booking.isPaid && (
                                <button className='px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-500 transition-all cursor-pointer hover:text-white'>
                                    Pay Now
                                </button>
                            )}

                        </div>

                    </div>
                ))}

            </div>
        </div>
    )
}

export default MyBookings