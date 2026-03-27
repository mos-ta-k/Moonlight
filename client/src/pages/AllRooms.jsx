import React, { useState } from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import StarRating from '../components/StarRating'

const AllRooms = () => {

  const navigate = useNavigate()

  const [openFilters, setOpenFilters] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedPrices, setSelectedPrices] = useState([])
  const [selectedSort, setSelectedSort] = useState("all")


  const CheckBox = ({ label, selected, onChange }) => {
    return (
      <label className='flex gap-4 items-center cursor-pointer mt-4 text-base'>

        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onChange(e.target.checked, label)}
          className='w-5 h-5 accent-black cursor-pointer'
        />

        <span className='select-none text-base font-light'>
          {label}
        </span>

      </label>
    )
  }

  const RadioButton = ({ label, selected, onChange }) => {
    return (
      <label className='flex gap-4 items-center cursor-pointer mt-4 text-base'>

        <input
          type="radio"
          name="sortOption"
          checked={selected}
          onChange={() => onChange(label)}
          className='w-5 h-5 accent-black cursor-pointer'
        />

        <span className='select-none text-base font-light'>
          {label}
        </span>

      </label>
    )
  }



  const roomTypes = ["all", "single", "double", "suite", "family"]
  const priceRanges = ["all", "under 5000", "under 10000", "under 15000", "under 20000"]
  const sortOptions = ["all", "price (low to high)", "price (high to low)", "Newest first"]



  const handleTypeChange = (checked, value) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, value])
    } else {
      setSelectedTypes(prev => prev.filter(item => item !== value))
    }
  }

  const handlePriceChange = (checked, value) => {
    if (checked) {
      setSelectedPrices(prev => [...prev, value])
    } else {
      setSelectedPrices(prev => prev.filter(item => item !== value))
    }
  }

  const handleSortChange = (value) => {
    setSelectedSort(value)
  }

  const handleNavigate = (id) => {
    navigate(`/room/${id}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const filteredRooms = roomsDummyData
    .filter(room => {
      if (selectedTypes.length === 0 || selectedTypes.includes("all")) return true
      return selectedTypes.includes(room.type)
    })
    .filter(room => {
      if (selectedPrices.length === 0 || selectedPrices.includes("all")) return true

      return selectedPrices.some(price => {
        if (price === "under 5000") return room.pricePerNight < 5000
        if (price === "under 10000") return room.pricePerNight < 10000
        if (price === "under 15000") return room.pricePerNight < 15000
        if (price === "under 20000") return room.pricePerNight < 20000
        return true
      })
    })

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (selectedSort === "price (low to high)") {
      return a.pricePerNight - b.pricePerNight
    }
    if (selectedSort === "price (high to low)") {
      return b.pricePerNight - a.pricePerNight
    }
    return 0
  })

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>

      <div className='w-full'>

        {/* Heading */}
        <div className='flex flex-col items-start text-left mb-6'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>
            Hotel Rooms
          </h1>
          <p className='text-base text-gray-500/90 mt-1.5'>
            Take advantage of our best prices and offers
          </p>
        </div>

        {/* Rooms */}
        {sortedRooms.map((room) => (
          <div
            key={room._id}
            className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:border-0'
          >

            {/* Image */}
            <img
              src={room.images?.[0]}
              alt="hotel"
              className='w-full md:w-1/2 max-h-72 rounded-xl shadow-lg object-cover cursor-pointer'
              onClick={() => handleNavigate(room._id)}
            />

            {/* Info */}
            <div className='md:w-1/2 flex flex-col gap-3'>

              <p className='text-gray-500 text-base'>
                {room.hotel?.city}
              </p>

              <p
                className='font-playfair text-3xl text-gray-800 cursor-pointer'
                onClick={() => handleNavigate(room._id)}
              >
                {room.hotel?.name}
              </p>

              <div className='flex items-center'>
                <StarRating rating={room.rating} />
                <p className='ml-2 text-base'>200+ reviews</p>
              </div>

              <div className='flex items-center gap-2 text-gray-500 text-sm'>
                <img src={assets.locationIcon} alt="location" />
                <span>{room.hotel?.address}</span>
              </div>

              {/* Amenities */}
              <div className='flex flex-wrap gap-4 mt-3'>
                {room.amenities?.map((item, index) => (
                  <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5ff]/70'>
                    <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                    <p className='text-sm'>{item}</p>
                  </div>
                ))}
              </div>

              <p className='text-xl font-medium text-gray-700'>
                ${room.pricePerNight}/night
              </p>

            </div>
          </div>
        ))}

      </div>

      <div className='bg-white w-full lg:w-80 border border-gray-300 text-gray-700 lg:mt-16'>

        <div className={`flex justify-between items-center px-5 py-3 border-gray-300 ${openFilters ? "border-b" : ""}`}>
          <p className='text-lg font-semibold text-gray-900'>Filter</p>

          <div className='text-sm cursor-pointer'>
            <span className='lg:hidden' onClick={() => setOpenFilters(!openFilters)}>
              {openFilters ? "Hide" : "Show"}
            </span>
            <span className='hidden lg:block'>Clear all</span>
          </div>
        </div>

        {/* Content */}
        <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-300`}>

          {/* Room Type */}
          <div className='px-5 pt-5'>
            <p className='font-semibold text-gray-900 text-lg'>Room Type</p>
            {roomTypes.map((type, index) => (
              <CheckBox
                key={index}
                label={type}
                selected={selectedTypes.includes(type)}
                onChange={handleTypeChange}
              />
            ))}
          </div>

          {/* Price */}
          <div className='px-5 pt-5'>
            <p className='font-semibold text-gray-900 text-lg'>Price</p>
            {priceRanges.map((price, index) => (
              <CheckBox
                key={index}
                label={price}
                selected={selectedPrices.includes(price)}
                onChange={handlePriceChange}
              />
            ))}
          </div>

          {/* Sort */}
          <div className='px-5 pt-5 pb-5'>
            <p className='font-semibold text-gray-900 text-lg'>Sort By</p>
            {sortOptions.map((sort, index) => (
              <RadioButton
                key={index}
                label={sort}
                selected={selectedSort === sort}
                onChange={handleSortChange}
              />
            ))}
          </div>

        </div>

      </div>

    </div>
  )
}

export default AllRooms