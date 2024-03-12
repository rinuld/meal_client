import Header from "../components/Header";
import { Link } from "react-router-dom";
import ActivityMenu from "../components/activityComponents/ActivityMenu";


function ActivityDetails() {
    console.log('Render Activity Details');
    return (
        <div className="indicator-details">
            <Header title= {
                <div className="header">
                    <h2>
                        <Link 
                            style={{
                                textDecoration: "none",
                                color: "#106544",
                                transition: "color 0.3s ease",
                                cursor: "pointer"
                            }}
                            onMouseEnter={(e) => e.target.style.color = "#a3c639"}
                            onMouseLeave={(e) => e.target.style.color = "#106544"}
                            to={`/activities`}>Activity
                        </Link> / Activity Details
                    </h2>
                </div>
            } />
            <ActivityMenu />
        </div>
    )
}

export default ActivityDetails