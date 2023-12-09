import { Link } from "react-router-dom";
import Header from "../components/Header";
import ActivityMenu from "../components/activityComponents/ActivityMenu";

function ActivityDetails() {

    console.log('Render Activity Details');
    return (
        <div className="indicator-details">
            <Header title="Activity/ Activity Details" />
            <h4>
                <Link to={`/activities`} className="go-back">
                    Back
                </Link>
            </h4>
            <ActivityMenu />
        </div>
    )
}

export default ActivityDetails