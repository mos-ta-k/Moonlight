import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { assets, facilityIcons } from '../assets/assets'
import StarRating from '../components/StarRating'
import { useAppContext } from '../context/AppContext'

const AllRooms = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const { rooms, navigate, currency } = useAppContext();

  const [openFilters, setOpenFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  })
  const [selectedSort, setSelectedSort] = useState("")

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

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Room"]
  const priceRanges = [
    '0 to 500',
    '500 to 1000',
    '1000 to 2000',
    '2000 to 3000'
  ]
  const sortOptions = ["price (low to high)", "price (high to low)", "Newest first"]

  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [type]: checked
          ? [...prevFilters[type], value]
          : prevFilters[type].filter(item => item !== value)
      }
      return updatedFilters
    })
  }

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption)
  }

  const handleNavigate = (roomId) => {
    navigate(`/rooms/${roomId}`)
    scrollTo(0, 0)
  }

  const clearAllFilters = () => {
    setSelectedFilters({ roomType: [], priceRange: [] })
    setSelectedSort("")
    setSearchParams({})
  }

  const filteredRooms = useMemo(() => {
    if (!rooms) return []

    const destination = searchParams.get('destination')

    return rooms
      .filter(room => {
        // Room type filter (case-insensitive)
        const typeMatch =
          selectedFilters.roomType.length === 0 ||
          selectedFilters.roomType.some(
            t => t.toLowerCase() === room.roomType?.toLowerCase()
          )

        // Price range filter
        const priceMatch =
          selectedFilters.priceRange.length === 0 ||
          selectedFilters.priceRange.some(range => {
            const [min, max] = range.split(' to ').map(Number)
            return room.pricePerNight >= min && room.pricePerNight <= max
          })

        // Destination filter — checks both city and hotel name
        const destMatch =
          !destination ||
          room.hotel?.city?.toLowerCase().includes(destination.toLowerCase()) ||
          room.hotel?.name?.toLowerCase().includes(destination.toLowerCase())

        return typeMatch && priceMatch && destMatch
      })
      .sort((a, b) => {
        if (selectedSort === "price (low to high)") return a.pricePerNight - b.pricePerNight
        if (selectedSort === "price (high to low)") return b.pricePerNight - a.pricePerNight
        if (selectedSort === "Newest first") return new Date(b.createdAt) - new Date(a.createdAt)
        return 0
      })
  }, [rooms, selectedFilters, selectedSort, searchParams])

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 gap-8'>

      {/* Rooms List */}
      <div className='w-full lg:flex-1'>

        {/* Heading */}
        <div className='flex flex-col items-start text-left mb-6'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>
            Hotel Rooms
          </h1>
          <p className='text-base text-gray-500/90 mt-1.5'>
            Take advantage of our best prices and offers
          </p>
        </div>

        {/* No results message */}
        {filteredRooms.length === 0 && (
          <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
            <p className='text-xl font-medium'>No rooms found</p>
            <p className='text-sm mt-1'>Try adjusting your filters</p>
            <button
              onClick={clearAllFilters}
              className='mt-4 px-5 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition'
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Rooms */}
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:border-0'
          >

            {/* Image */}
            <img
              src={room.images?.[0]}
              alt="hotel room"
              className='w-full md:w-1/2 max-h-72 rounded-xl shadow-lg object-cover cursor-pointer'
              onClick={() => handleNavigate(room._id)}
            />

            {/* Info */}
            <div className='md:w-1/2 flex flex-col gap-3'>

              {/* City */}
              <p className='text-gray-500 text-sm uppercase tracking-wide'>
                {room.hotel?.city || "Unknown City"}
              </p>

              {/* Hotel Name */}
              <p
                className='font-playfair text-3xl text-gray-800 cursor-pointer hover:text-gray-600 transition-colors'
                onClick={() => handleNavigate(room._id)}
              >
                {room.hotel?.name || "Unknown Hotel"}
              </p>

              {/* Room Type */}
              <p className='text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit'>
                {room.roomType}
              </p>

              {/* Address */}
              <div className='flex items-center gap-2 text-gray-500 text-sm'>
                <img src={assets.locationIcon} alt="location" className='w-4 h-4 flex-shrink-0' />
                <span>{room.hotel?.address || "Address not available"}</span>
              </div>

              {/* Max Occupancy */}
              <p className='text-sm text-gray-500'>
                Max Occupancy: {room.maxOccupancy} {room.maxOccupancy === 1 ? "guest" : "guests"}
              </p>

              {/* Amenities */}
              <div className='flex flex-wrap gap-3 mt-1'>
                {room.amenities?.map((item, index) => (
                  <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5ff]/70'>
                    {facilityIcons[item] && (
                      <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                    )}
                    <p className='text-sm'>{item}</p>
                  </div>
                ))}
              </div>

              {/* Price */}
              <p className='text-xl font-medium text-gray-700 mt-1'>
                {currency}{room.pricePerNight}/night
              </p>

              {/* Book Button */}
              <button
                onClick={() => handleNavigate(room._id)}
                className='mt-2 w-fit px-6 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors'
              >
                Book Now
              </button>

            </div>
          </div>
        ))}

      </div>

      {/* Filter Sidebar */}
      <div className='bg-white w-full lg:w-80 border border-gray-300 text-gray-700 lg:mt-16 lg:sticky lg:top-28 flex-shrink-0'>

        <div className={`flex justify-between items-center px-5 py-3 border-gray-300 ${openFilters ? "border-b" : ""}`}>
          <p className='text-lg font-semibold text-gray-900'>Filter</p>

          <div className='text-sm cursor-pointer text-gray-500 hover:text-black transition-colors'>
            <span className='lg:hidden' onClick={() => setOpenFilters(!openFilters)}>
              {openFilters ? "Hide" : "Show"}
            </span>
            <span className='hidden lg:block' onClick={clearAllFilters}>Clear all</span>
          </div>
        </div>

        {/* Filter Content */}
        <div className={`${openFilters ? "h-auto" : "h-0 lg:h-auto"} overflow-hidden transition-all duration-300`}>

          {/* Room Type */}
          <div className='px-5 pt-5'>
            <p className='font-semibold text-gray-900 text-base'>Room Type</p>
            {roomTypes.map((type, index) => (
              <CheckBox
                key={index}
                label={type}
                selected={selectedFilters.roomType.includes(type)}
                onChange={(checked) => handleFilterChange(checked, type, "roomType")}
              />
            ))}
          </div>

          {/* Price Range */}
          <div className='px-5 pt-5'>
            <p className='font-semibold text-gray-900 text-base'>Price per Night ({currency})</p>
            {priceRanges.map((price, index) => (
              <CheckBox
                key={index}
                label={`${currency}${price.replace(' to ', ` - ${currency}`)}`}
                selected={selectedFilters.priceRange.includes(price)}
                onChange={(checked) => handleFilterChange(checked, price, "priceRange")}
              />
            ))}
          </div>

          {/* Sort */}
          <div className='px-5 pt-5 pb-5'>
            <p className='font-semibold text-gray-900 text-base'>Sort By</p>
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