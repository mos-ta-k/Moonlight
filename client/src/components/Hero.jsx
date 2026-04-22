import { assets, cities } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext.jsx';
import { useState } from 'react';

const Hero = () => {
    const { navigate, getToken, axios, setSearchedCities } = useAppContext();
    const [destination, setDestination] = useState("");

    const onSearch = async (e) => {
        e.preventDefault();

        const trimmedDestination = destination.trim();

        // Prevent empty search
        if (!trimmedDestination) return;

        // Navigate to results page
        navigate(`/rooms?destination=${encodeURIComponent(trimmedDestination)}`);
        window.scrollTo(0, 0);

        // Update recent searched cities safely
        setSearchedCities((prevSearchedCities) => {
            const prev = Array.isArray(prevSearchedCities) ? prevSearchedCities : [];

            const filtered = prev.filter(c => c !== trimmedDestination);
            const updated = [trimmedDestination, ...filtered];

            return updated.slice(0, 3); // keep max 3
        });

        // Store recent search on server
        try {
            await axios.post(
                "/api/user/store-recent-search",
                { recentSearchedCities: trimmedDestination },
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`
                    }
                }
            );
        } catch (error) {
            console.error("Failed to store recent search:", error);
        }
    };

    return (
        <div className="relative flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url('/src/assets/heroImage.png')] bg-cover bg-no-repeat bg-center h-[100vh]">
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80 z-0 pointer-events-none"></div>

            <p className='relative z-10 py-1 text-xl mt-20'>The Ultimate Hotel Experience</p>

            <h1 className='relative z-10 font-playfair text-2xl md:text-5xl md:leading-[56px] mt-4 font-bold'>
                Discover Your Next <br /> Perfect Getaway Destination
            </h1>

            <p className='relative z-10 max-w-130 mt-2 mb-4 text-[20px] md:text-base'>
                Book your dream hotel stay with ease. Explore top destinations, exclusive deals, and unforgettable experiences.
            </p>

            <form
                onSubmit={onSearch}
                className='relative z-10 bg-white text-gray-500 rounded-lg px-6 py-4 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'
            >

                {/* Destination */}
                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="destinationInput">Destination</label>
                    </div>

                    <input
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        list='destinations'
                        id="destinationInput"
                        type="text"
                        className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                        placeholder="Type here"
                        required
                    />

                    <datalist id="destinations">
                        {cities.map((city, index) => (
                            <option key={index} value={city} />
                        ))}
                    </datalist>
                </div>

                {/* Check In */}
                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkIn">Check in</label>
                    </div>

                    <input
                        id="checkIn"
                        type="date"
                        className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                    />
                </div>

                {/* Check Out */}
                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calenderIcon} alt="" className='h-4' />
                        <label htmlFor="checkOut">Check out</label>
                    </div>

                    <input
                        id="checkOut"
                        type="date"
                        className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                    />
                </div>

                {/* Guests */}
                <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                    <label htmlFor="guests">Guests</label>

                    <input
                        min={1}
                        max={4}
                        id="guests"
                        type="number"
                        className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
                        placeholder="1"
                    />
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1'
                >
                    <img src={assets.searchIcon} alt="Search Icon" className='h-7' />
                    <span>Search</span>
                </button>

            </form>
        </div>
    );
};

export default Hero;