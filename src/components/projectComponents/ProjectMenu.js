import { useContext, useState } from "react";
import ProjectContext from "../../context/ProjectProvider";
import Team from "../Team";
import Partners from "../Partners.js";
import ProjectDetails from "./ProjectDetails";

function ProjectMenu() {
    const [activeTab, setActiveTab] = useState('details');
    const { project } = useContext(ProjectContext);
    const projectID = project ? project.split('-')[0] : '';

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="card-menu my-0">
                <ul>
                    <li className={`tab-header ${activeTab === 'details' ? 'active-menu' : ''}`} onClick={() => handleTabClick('details')}>
                        <div className="menu-item">
                            <i className="fas fa-clipboard-check"></i>&nbsp;
                            <span>Details</span>
                        </div>
                    </li>
                    <li className={`tab-header ${activeTab === 'team' ? 'active-menu' : ''}`} onClick={() => handleTabClick('team')}>
                        <div className="menu-item">
                            <i className="fas fa-users"></i>&nbsp;
                            <span>Team</span>
                        </div>
                    </li>
                    <li className={`tab-header ${activeTab === 'partners' ? 'active-menu' : ''}`} onClick={() => handleTabClick('partners')}>
                        <div className="menu-item">
                            <i className="fas fa-handshake"></i>&nbsp;
                            <span>Partners</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="contents">
            <div
                className={`${activeTab === 'details' ? 'display-content' : 'tab-content '}`}
                id="contentdetails"
            >
                <div id="sub-details">
                    <ProjectDetails projectID={projectID}/>
                </div>
            </div>

            <div
                className={`${activeTab === 'team' ? 'display-content' : 'tab-content '}`}
                id="contentteam"
            >
                <div id="sub-details">
                    <Team />
                </div>
            </div>

            <div
                className={`${activeTab === 'partners' ? 'display-content' : 'tab-content '}`}
                id="contentpartners"
            >
                <div id="sub-details">
                    <Partners projectID={projectID}></Partners>
                </div>
            </div>
            </div>
        </>
    )
}

export default ProjectMenu;