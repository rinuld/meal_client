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
            fetch(`https://meal-server.negrosanonyoungleaders.org/api/indicatordetails/${id}`)
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
            fetch(`https://meal-server.negrosanonyoungleaders.org/api/indicatorData/${id}`)
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
                            to={`/indicators`}>Indicators
                        </Link> / Indicator Details
                    </h2>
                </div>
            } />
  
            <IndicatorMenu indicatorDetails={indicatorDetails} indicatorData={indicatorData} />
        </div>
    )
}

export default IndicatorDetails