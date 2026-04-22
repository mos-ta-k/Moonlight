import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, facilityIcons } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { rooms, getToken, axios } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  // Mock data for common specs - replace with your real import if available
  const roomCommonData = [
    { icon: assets.locationIcon, title: "Great Location", description: "90% of recent guests gave the location a 5-star rating." },
    { icon: assets.locationIcon, title: "Self check-in", description: "Check yourself in with the smart lock." },
    { icon: assets.locationIcon, title: "Free cancellation", description: "Full refund if cancelled 48 hours before check-in." }
  ];

  const checkAvailability = async () => {
    try {
      if(checkInDate > checkOutDate){
        toast.error("Check-out date must be after check-in date");
        return;
      }
      const { data } = await axios.post(`/api/bookings/check-availability`, {
        room: id,
        checkInDate,
        checkOutDate,
      }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
       if(data.isAvailable){
        toast.success("Room is available! You can now book.");
        setIsAvailable(true);
       }else{
        toast.error("Room is not available for selected dates.");
        setIsAvailable(false);
       }
      } else {
        toast.error(data.message || data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //onsubmit handler function to check availibility
  const onSubmitHandler = async (e) =>{
    try{
      e.preventDefault();
      if(!isAvailable){
        return checkAvailability();
      }else{
        const {data} = await axios.post('/api/bookings/book', {room:id, checkInDate, checkOutDate, guests, paymentMethod: 'Pay at hotel'},
          {headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        } 
        )
        if(data.success){
          toast.success("Room booked successfully");
          navigate('/my-bookings');
          window.scrollTo(0, 0);
        }else{
          toast.error(data.message);
        }
      }
    }catch(error){
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      const foundRoom = rooms.find((r) => r._id === id);
      if (foundRoom) {
        setRoom(foundRoom);
        setMainImage(foundRoom.images[0]);
      }
    }
  }, [id, rooms]);

  const handleImageClick = (image) => {
    setMainImage(image);
  };


  if (!room) {
    return (
      <div className="py-40 text-center">
        <p className="text-xl text-gray-500">Loading room details...</p>
      </div>
    );
  }

  return (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold">
          {room.hotel?.name}{" "}
          <span className="font-normal text-sm text-gray-500">({room.roomType})</span>
        </h1>
        <p className="text-sm font-medium px-3 py-1 rounded-full bg-orange-500 text-white">
          20% OFF
        </p>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2 text-gray-600">200+ reviews</p>
      </div>

      <div className="flex items-center gap-1 text-gray-500 mt-2">
        <img src={assets.locationIcon} alt="location" className="w-4 h-4" />
        <span>{room.hotel?.address}</span>
      </div>

      {/* Image Gallery */}
      <div className="flex flex-col lg:flex-row mt-6 gap-6">
        <div className="lg:w-1/2 w-full">
          <img
            src={mainImage}
            alt="main-room"
            className="w-full h-[450px] rounded-xl shadow-lg object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room.images.map((image, index) => (
            <img
              key={index}
              onClick={() => handleImageClick(image)}
              src={image}
              alt={`room-view-${index}`}
              className={`w-full h-52 rounded-xl shadow-md object-cover cursor-pointer transition-all ${
                mainImage === image ? "ring-4 ring-orange-500" : "hover:opacity-80"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Amenities & Price Section */}
      <div className="flex flex-col md:flex-row md:justify-between mt-10 gap-10">
        <div className="flex-1">
          <h2 className="text-3xl font-playfair md:text-4xl mb-4">
            Experience Luxury Like Never Before
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            {room.amenities?.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                <img
                  className="w-5 h-5"
                  src={facilityIcons[item] || assets.locationIcon}
                  alt={item}
                />
                <p className="text-sm capitalize">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
          <p className="text-2xl font-bold text-gray-800">
            ৳{room.pricePerNight} <span className="text-base font-normal text-gray-500">/ night</span>
          </p>
          <div className="flex items-center gap-1 mt-2 border-b pb-4">
            <StarRating />
            <p className="text-gray-500 text-sm">200+ reviews</p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <form 
        onSubmit={onSubmitHandler}
        className="flex flex-col md:flex-row items-end justify-between bg-white shadow-2xl p-8 rounded-2xl mx-auto mt-16 max-w-6xl gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">Check-in</label>
            <input
              type="date"
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
              value={checkInDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">Check-out</label>
            <input
              type="date"
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
              value={checkOutDate}
              min={checkInDate} 
              disabled={!checkInDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-2">Guests</label>
            <input
              placeholder="1"
              type="number"
              min={1}
              max={room.maxGuests || 4}
              className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-opacity-90 text-white font-bold py-4 px-10 rounded-lg transition-all active:scale-95 w-full md:w-auto"
        >
          {isAvailable ? "Book Now" : "Check Availability"}
        </button>
      </form>

      {/* Room Details Text */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-4">
              <img src={spec.icon} alt="icon" className="w-6 mt-1" />
              <div>
                <p className="font-bold text-lg">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-gray-600 leading-relaxed border-l pl-8">
           <p className="mb-4">
            Guest will be allocated on the ground floor according to availability. 
            This {room.roomType} offers a premium experience with modern touches.
          </p>
          <button className="text-primary font-bold underline decoration-2 underline-offset-4">
            Read more about the property
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-playfair mb-6">Location on Map</h2>
        <div className="rounded-2xl overflow-hidden shadow-lg h-[450px] border">
          <iframe
            title="map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(room.hotel?.address || "")}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;