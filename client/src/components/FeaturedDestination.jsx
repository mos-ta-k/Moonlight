import HotelCard from './HotelCard'
import Title from './title'
import { useAppContext } from '../context/AppContext'

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext();

  if (!rooms || rooms.length === 0) return null;

  return (
    <div className='flex flex-col items-center bg-slate-50 px-3 md:px-9 lg:px-12 py-15'>
      <Title
        title='Featured Destinations'
        subtitle='Explore our top handpicked selections of exceptional properties around the country, offering unparalleled comfort, luxury, and authentic experiences.'
      />
      <div className='flex flex-wrap items-center justify-center px-6  md:px-16 lg:px-24 bg-slate-50 py-15 pb-5 gap-7'>
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard
            key={room._id}
            room={room}
            index={index}
            onClick={() => { navigate(`/rooms/${room._id}`); window.scrollTo(0, 0) }}
          />
        ))}
      </div>
      <button
        onClick={() => { navigate('/rooms'); window.scrollTo(0, 0) }}
        className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
        View All Destinations
      </button>
    </div>
  )
}

export default FeaturedDestination