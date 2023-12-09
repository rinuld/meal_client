// Used to create navigation routes to install use npm i react-router-dom@6
import { Link } from 'react-router-dom';
import React, { memo, useState } from 'react';
import homelogo from '../assets/images/home.ico';
import projectlogo from '../assets/images/folder.svg';
import activitylogo from '../assets/images/document.svg';
import mobile from '../assets/images/mobile.svg';

const SideBar = memo(({auth}) => {
    const [activeItem, setActiveItem] = useState(() => {
    const activeItemFromStorage = localStorage.getItem('activeItem');
    console.log("active side bar item " + activeItemFromStorage);
    return activeItemFromStorage || "Projects";
  });

    const handleMenuClick = (name) => {
    setActiveItem(name);
    localStorage.setItem('activeItem', name);
    }
    
    console.log("Render SideBar"+auth.role);
    return (
        <div className='sidebar-container'>
            <nav className="sidebar">
                <p>Menu</p>
                <div className='nav flex-column'>
                <Link
                    to="/projects"
                    className={`nav-item ${activeItem === 'Projects' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Projects')}
                >
                    <img src={projectlogo} alt='PROJECTS' />Projects
                </Link>
                <Link
                    to="/details"
                    className={`nav-item project-sub-item ${activeItem === 'Details' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Details')}
                >
                    <img src={activitylogo} alt='DETAILS'/>Details
                </Link>
                <Link
                    to="/activities"
                    className={`nav-item project-sub-item ${activeItem === 'Activity' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Activity')}
                >
                    <img src={mobile} alt='ACTIVITIES'/>Activities
                </Link>
                <Link
                    to="/indicators"
                    className={`nav-item project-sub-item ${activeItem === 'Indicator' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Indicator')}
                >
                    <i className="fa fa-signal"></i>&nbsp;Indicators
                </Link>
                {auth.role==="Super Admin" &&
                <Link
                    to="/voucher"
                    className={`nav-item ${activeItem === 'Voucher' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Voucher')}
                >
                    <i className="fa fa-gift"></i>&nbsp;Make Payments
                </Link>
                }
                <Link
                    to="/logs"
                    className={`nav-item ${activeItem === 'Logs' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Logs')}
                >
                    <i className="fas fa-edit"></i>&nbsp;Logs
                </Link>
                {/* <Link
                    to="/"
                    className={`nav-item ${activeItem === 'Dashboard' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Dashboard')}
                >
                    <img src={homelogo} alt='DASHBOARD'/>Dashboard
                </Link> */}
                </div>
            </nav>
        </div>
    )
})

export default React.memo(SideBar);