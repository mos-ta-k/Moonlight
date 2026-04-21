import React, { useState } from 'react'
import Title from '../../components/title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddRoom = () => {

    const {axios, getToken} = useAppContext();

    const [images, setImages] = useState({
        1: null,
        2: null,
        3: null,
        4: null,
    })

    const [input, setInput] = useState({
        roomType: "",
        pricePerNight: "",
        maxOccupancy: "",
        amenities: {
            "Free WiFi": false,
            "Free Breakfast": false,
            "Room Service": false,
            "Mountain View": false,
            "Pool Access": false,
        },
        description: "",
        hotelId: ""
    })

    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        // check if all inputs are filled
        if(!input.roomType || !input.pricePerNight || !input.amenities || !input.object.values(images).some(image => image)){
            toast.error("Please fill all the fields")
            return
        }
        setLoading(true)
        try {
            const formData = new FormData();
            formData.append('roomType', input.roomType)
            formData.append('pricePerNight', input.pricePerNight)

            //converting amenities into array and keeping enabled amenities
            const amenities = Object.keys(input.amenities).filter(key => input.amenities[key])
            formData.append('amenities', JSON.stringify(amenities))

            //adding images to formdata
            Object.keys(images).forEach((key)=>{
                images[key] && formData.append('images', images[key])
            })

            const {data} = await axios.post('/api/rooms/', formData, {Headers: {Auhtorization: `Bearer ${await getToken}`}})

            if(data.success){
                toast.success(data.message)
                setInput({
                    roomType: "",
                    pricePerNight: 0,
                    amenities: {
                        "Free WiFi": false,
                        "Free Breakfast": false,
                        "Room Service": false,
                        "Mountain View": false,
                        "Pool Access": false,
                    },
                })
                setImages({
                    1: null,
                    2: null,
                    3: null,
                    4: null,
                })
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }



    }

    return (
        <form onSubmit={onSubmitHandler}>
            <Title align='left' font='outfit' title='Add Room' subtitle='Add a new room to your hotel listing' />

            <p className='text-gray-800 mt-10'>Images</p>
            <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
                {Object.keys(images).map((key) => (
                    <label htmlFor={`roomImage${key}`} key={key}>
                        <img
                            src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
                            alt=""
                            className='max-h-13 cursor-pointer opacity-80'
                        />
                        <input
                            type="file"
                            accept='image/*'
                            id={`roomImage${key}`}
                            hidden
                            onChange={e => setImages({ ...images, [key]: e.target.files[0] })}
                        />
                    </label>
                ))}
            </div>

            <div className='flex w-full max-sm:flex-col sm:gap-4 mt-4'>
                <div className='flex-1 max-w-48'>
                    <p className='text-gray-800 mt-4'>Room Type</p>
                    <select
                        value={input.roomType}
                        onChange={e => setInput({ ...input, roomType: e.target.value })}
                        className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'
                    >
                        <option value="Single Bed">Single Bed</option>
                        <option value="Double Bed">Double Bed</option>
                        <option value="Family Room">Family Room</option>
                        <option value="Luxury Room">Luxury Room</option>
                    </select>
                </div>

                <div>
                    <p className='mt-4 text-gray-800'>
                        Price <span className='text-xs'>/night</span>
                    </p>
                    <input
                        type="number"
                        placeholder='0'
                        className='border border-gray-300 mt-1 rounded p-2 w-24'
                        value={input.pricePerNight}
                        onChange={e => setInput({ ...input, pricePerNight: e.target.value })}
                    />
                </div>
            </div>

            <p className='mt-4 text-gray-800'>Amenities</p>
            <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm gap-4'>
                {Object.keys(input.amenities).map((amenity, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`amenities${index + 1}`}
                            checked={input.amenities[amenity]}
                            onChange={() => setInput({
                                ...input,
                                amenities: { ...input.amenities, [amenity]: !input.amenities[amenity] }
                            })}
                        />
                        <label htmlFor={`amenities${index + 1}`}> {amenity}</label>
                    </div>
                ))}
            </div>

            <button className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer'>
                Add Room
            </button>
        </form>
    )
}

export default AddRoom