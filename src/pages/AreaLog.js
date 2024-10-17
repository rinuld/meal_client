import { useContext, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/AreaLog.css';
import AuthContext from "../context/AuthProvider";
import { InsertLogData } from "../components/InsertLogData";
import DatePicker from "react-datepicker";

function AreaLog() {
    const initialState = {
        reportedBy: "",
        location: "",
        reportingPeriod: "",
    };
   
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState(initialState);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const clearForm = () => {
        setFormData(initialState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        // <div className="create-forms">
        //     <form id="areaLogForm" onSubmit={handleSubmit}>
        //     </form>
        // </div>
        <div className="center">
            <p>Under development. Use this <a href="https://docs.google.com/document/d/1TuIUq8vEUw6Lg8U_EnkR9xbYGhXtPQbwAGbKnbxacZg/edit?usp=sharing">Google Docs link</a> for the meantime.</p>
        </div>
    );
}

export default AreaLog;