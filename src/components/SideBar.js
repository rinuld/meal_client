// Used to create navigation routes to install use npm i react-router-dom@6
import { Link } from 'react-router-dom';
import React, { memo, useState } from 'react';
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
                <div className='nav sidebar-elements'>
                <Link
                    to="/projects"
                    className={`nav-item ${activeItem === 'Projects' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Projects')}
                >
                    <i class="fa-solid fa-folder-open"></i><p>Projects</p>
                </Link>
                <Link
                    to="/details"
                    className={`nav-item project-sub-item ${activeItem === 'Details' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Details')}
                >
                    <i class="fa-solid fa-clipboard"></i><p>Details</p>
                </Link>
                <Link
                    to="/activities"
                    className={`nav-item project-sub-item ${activeItem === 'Activity' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Activity')}
                >
                    <i class="fa-solid fa-mobile-screen-button"></i><p>Activities</p>
                </Link>
                <Link
                    to="/indicators"
                    className={`nav-item project-sub-item ${activeItem === 'Indicator' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Indicator')}
                >
                    <i class="fa-solid fa-book-bookmark"></i><p>Indicators</p>
                </Link>
                {auth.role==="Super Admin" &&
                <Link
                    to="/activityReport"
                    className={`nav-item ${activeItem === 'Activity Report' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Activity Report')}
                >
                    <i className="fas fa-file-alt"></i><p>Activity Report</p>
                </Link>
                }
                <Link
                    to="/logs"
                    className={`nav-item ${activeItem === 'Logs' ? 'active' : ''}`}
                    onClick={() => handleMenuClick('Logs')}
                >
                    <i className="fas fa-edit"></i><p>Logs</p>
                </Link>
                </div>
            </nav>
        </div>
    )
})

export default React.memo(SideBar);