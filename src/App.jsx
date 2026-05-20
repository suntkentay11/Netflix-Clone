import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home'
import Navbar from './components/NavBar/Navbar'
import TVShows from './pages/TVShows/TVShows'
import Movies from './pages/Movies/Movies'
import NewPopular from './pages/NewPopular/NewPopular'
import MyList from './pages/MyList/MyList'
import GenrePage from './components/GenrePage/GenrePage'
import Login from './pages/Login/Login'
import Profiles from './pages/Profiles/Profiles'


const App = () => {
  const location = useLocation();

  const hideNavbar = location.pathname === '/login'|| location.pathname === '/profiles';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/" element={<Home />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/new-popular" element={<NewPopular />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/genre/:mediaType/:genreId/:genreName" element={<GenrePage />} />
      </Routes>
    </>
  )
}

export default App