  import { Route, Routes, useLocation } from 'react-router-dom'
  import Footer from './components/Footer'
  import Navbar from './components/Navbar'
  import AllRooms from './pages/AllRooms'
  import Home from './pages/Home'
  import MyBookings from './pages/MyBookings'
  import RoomDetails from './pages/RoomDetails'

  const App = () => {

    const isOwnerPath = useLocation().pathname.includes("owner")

    return (
      <div>
        {!isOwnerPath && <Navbar />}
        <div className='min-h-[70vh]'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/rooms' element={<AllRooms />} />
            <Route path='/room/:id' element={<RoomDetails />} />
            <Route path='/my-bookings' element={<MyBookings />} />
          </Routes>
        </div>
        <Footer />
      </div>
    )
  }

  export default App