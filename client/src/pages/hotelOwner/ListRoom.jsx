import { useEffect, useState } from 'react'
import Title from '../../components/title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ListRoom = () => {
    const [rooms, setRooms] = useState([])
    const {axios, getToken, user} = useAppContext();

    //fetch room for the hotel owner

    const fetchRooms = async () =>{
        try {
            const {data} = await axios.get('/api/rooms/owner', {headers: {Authorization: `Bearer ${await getToken()}`}})   
            
            if(data.success){
                setRooms(data.rooms)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
       if(user){
         fetchRooms()
       }
    },[user])

    const toggleAvailability = async (index, roomId) => {
        setRooms(prev =>
            prev.map((room, i) =>
                i === index ? { ...room, isAvailable: !room.isAvailable } : room
            )
        )
        try {
            const token = await getToken()
            const {data} = await axios.post('/api/rooms/toggle-availability', {roomId}, {headers: {Authorization: `Bearer ${token}`}})
            if(!data.success){
                toast.error(data.message)
                setRooms(prev =>
                    prev.map((room, i) =>
                        i === index ? { ...room, isAvailable: !room.isAvailable } : room
                    )
                )
            } else {
                toast.success(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            setRooms(prev =>
                 prev.map((room, i) =>
                     i === index ? { ...room, isAvailable: !room.isAvailable } : room
                 )
            )
        }
    }

    return (
        <div>
            <Title align="left" font="outfit" title="List Room" subtitle="Manage your room listings" />
            <p className='text-gray-500 mt-8'>All Rooms</p>

            <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>
                <table className='w-full'>
                    <thead className='bg-gray-50'>
                        <tr>
                            <th className='py-3 px-4 text-gray-800 font-medium'>Name</th>
                            <th className='py-3 px-4 text-gray-800 font-medium max-sm:hidden'>Facility</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Price / Night</th>
                            <th className='py-3 px-4 text-gray-800 font-medium text-center'>Actions</th>
                        </tr>
                    </thead>

                    <tbody className='text-sm'>
                        {rooms.map((item, index) => (
                            <tr key={index}>
                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.roomType}
                                </td>

                                <td className='max-sm:hidden py-3 px-4 text-gray-700 border-t border-gray-300'>
                                    {item.amenities.join(', ')}
                                </td>

                                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>
                                    ৳{item.pricePerNight}
                                </td>

                                <td className='py-2 px-4 border-t border-gray-300 text-sm text-center'>
                                    <label className='relative inline-flex items-center cursor-pointer text-gray-900 gap-3'>
                                        <input
                                            type="checkbox"
                                            className='sr-only peer'
                                            checked={item.isAvailable}
                                            onChange={() => toggleAvailability(index, item._id)}
                                        />
                                        <div className={`w-12 h-7 rounded-full transition-colors duration-200 ${item.isAvailable ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                                        <span className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${item.isAvailable ? 'translate-x-5' : ''}`}></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListRoom