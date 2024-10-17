import React, { memo, useState } from 'react';
import userimage from '../assets/images/user_default_white.svg';
import logo from '../assets/images/logowhite.png';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = memo(({ auth }) => {
    const navigate = useNavigate();

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('activeItem');
        localStorage.removeItem('selectedProject');
        sessionStorage.removeItem('token');
        navigate("/");
        window.location.reload();
    };

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg sticky-top">
            <div className="navbar-brand">
                <img src={logo} alt="NYLI" />
            </div>
            <div className="nav-right d-flex align-items-center">
                <span className="user-name">{auth.firstname}</span>
                <img src={userimage} alt="NYLI USER" className="user-image" />
                <div className="dropdown-profile" onMouseLeave={() => setIsDropdownOpen(false)}>
                    <div className='ellipis-toggle' onMouseEnter={() => setIsDropdownOpen(true)}>
                        <i className="fa fa-ellipsis-v btn-add"></i>
                    </div>
                    {isDropdownOpen && (
                        <div className='dropdown-content-menu'>
                            <ul>
                                <Link to="/profile" className="nav-item">
                                    <i className="fa fa-user"></i>
                                    <span>Profile</span>
                                </Link>
                                {auth.role === "Admin" &&
                                    <Link to="/addmember" className="nav-item">
                                        <i className="fa fa-user-plus"></i>
                                        <span>Users</span>
                                    </Link>}
                                <Link
                                    className="nav-item"
                                    onClick={logout}
                                >
                                    <i className="fa fa-sign-out"></i>
                                    <span>Logout</span>
                                </Link>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
});

export default NavBar;
