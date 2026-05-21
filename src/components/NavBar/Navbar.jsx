import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase";
import { useLists } from "../../context/ListContext";

const Navbar = () => {
    const navigate = useNavigate();

    const { activeProfile } = useLists();

    const handleSignOut = async () => {
    await logout();

    localStorage.removeItem("activeProfile");

    navigate("/login");
    };
  return (
    <div className='navbar'>
        <div className="navbar-left">
            <img src={logo} alt="Logo" />
            <ul className='nav__list'>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/tv-shows">Shows</Link></li>
                <li><Link to="/movies">Movies</Link></li>
                <li style={{ cursor: "not-allowed" }}>Games</li>
                <li><Link to="/new-popular">New & Popular</Link></li>
                <li><Link to="/my-list">My List</Link></li>
                <li style={{ cursor: "not-allowed" }}>Browse by Languages</li>
            </ul>
            <div className="browse__menu">
                <div className="browse__menu--browse">
                    <p>Browse</p>
                    <img src={caret_icon} alt="Caret" />
                </div>
                <div className="browse__overlay">
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/tv-shows">TV Shows</Link></li>
                        <li><Link to="/movies">Movies</Link></li>
                        <li style={{ cursor: "not-allowed" }}>Games</li>
                        <li><Link to="/new-popular">New & Popular</Link></li>
                        <li><Link to="/my-list">My List</Link></li>
                        <li style={{ cursor: "not-allowed" }}>Browse by Languages</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="navbar-right">
            <img src={search_icon} alt="Search" className='icons' />
            <p className='kids'>Kids</p>
            <img src={bell_icon} alt="Notifications" className='icons' />
            <div className="navbar__profile">
                <img
                    src={activeProfile?.avatar || profile_img}
                    alt="Profile"
                    className="profile"
                    />
                <img src={caret_icon} alt="Caret" />
                <div className="dropdown">
                    <div className="dropdown__item">
                        <FontAwesomeIcon icon="pencil" className='icon' />
                        <p>Manage Profiles</p>
                    </div>
                    <div className="dropdown__item">
                        <FontAwesomeIcon icon="user-pen" className='icon' />
                        <p>Transfer Profiles</p>
                    </div>
                    <div className="dropdown__item">
                        <FontAwesomeIcon icon="user" className='icon' />
                        <p>Account</p>
                    </div>
                    <div className="dropdown__item">
                        <FontAwesomeIcon icon="question" className='icon' />
                        <p>Help Center</p>
                    </div>
                    <div className="sign__out">
                        <p onClick={handleSignOut}>Sign Out of Netflix</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar