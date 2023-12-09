import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import IndicatorMenu from "../components/indicatorComponents.js/IndicatorMenu";

function IndicatorDetails() {
    const { id } = useParams();
    const [indicatorDetails, setData] = useState([]);
    const [indicatorData, setIndicatorData] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetch(`http://localhost:3001/api/indicatordetails/${id}`)
                .then(response => response.json())
                .then(data => {
                    setData(data[0]);
                })
                .catch(error => {
                    console.log('Error fetching activity details:', error);
                });
        }, 100);

        return () => clearTimeout(timer);
    }, [id]);


    useEffect(() => {
        const timer = setTimeout(() => {
            fetch(`http://localhost:3001/api/indicatorData/${id}`)
                .then(response => response.json())
                .then(data => {
                    setIndicatorData(data);
                })
                .catch(error => {
                    console.log('Error fetching activity details:', error);
                });
        }, 1000);

        return () => clearTimeout(timer);
    }, [id]);


    console.log('Render Activity Details');
    return (
        <div className="indicator-details">
            <Header title="Indicator/ Indicator Details" />
            <h4>
                <Link to={`/indicators`} className="go-back">
                    Back
                </Link>
            </h4>
            <IndicatorMenu indicatorDetails={indicatorDetails} indicatorData={indicatorData} />
        </div>
    )
}

export default IndicatorDetails