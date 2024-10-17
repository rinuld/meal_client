import { useContext, useEffect, useMemo, useState } from "react";
import ProjectContext from "../../context/ProjectProvider";
import DatePickerInput from "../DatepickerInput";
import InputText from "../utils/InputText";
import { useParams } from "react-router-dom";
import InputSelection from "../utils/InputSelection";
import { toast } from "react-toastify";
import { InsertLogData } from "../InsertLogData";
import Axios from 'axios';
import InputCurrency from "../utils/InputCurrency";
import InputTexticon from "../utils/InputTextIcon";
import DataTable from "../DataTable";
import AuthContext from "../../context/AuthProvider";

function ActivityMenu() {
    const { auth } = useContext(AuthContext);
    const currentDate = new Date();
    const [activeTab, setActiveTab] = useState('activities');
    const [records, setRecords] = useState([]);

    const { id } = useParams();
    const [activityName, setActivityName] = useState("");
    const [activityCode, setActivityCode] = useState(id);
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [status, setStatus] = useState({});
    const [budget, setBudget] = useState(0);
    const [actual, setActual] = useState(0);

    // Get Details of a specific project
    useEffect(() => {
        fetch(`http://localhost:3001/api/activityDetails/${id}`)
            .then(response => response.json())
            .then(data => {
                const activityData = data[0];
                setActivityName(activityData.activityName);
                setStatus({ value: activityData.status, label: activityData.status });
                setSelectedDate(activityData.actDate);
                setBudget(InputCurrency(activityData.budget));
                setActual(InputCurrency(activityData.actual));
            })
            .catch(error => {
                console.log('Error fetching activity details:', error);
            });
    }, [id]);

    useEffect(() => {
        Axios.get(`http://localhost:3001/api/activityRecords/${id}`)
            .then(response => {
                setRecords(response.data);
            })
            .catch(error => {
                console.log('Error fetching participants data:', error);
            });
    }, [])

    const statusselection = [
        { value: 'Ongoing', label: 'Ongoing' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Delayed', label: 'Delayed' },
        { value: 'On Hold', label: 'On Hold' },
    ];

    const columns = useMemo(
        () => [
          {
            Header: 'Code',
            accessor: 'accountcode',
            width: '20%',
          },
          {
            Header: 'Title',
            accessor: 'accounttitle',
            width: '40%',
          },
          {
            Header: 'Amount',
            accessor: row => InputCurrency(`${row.amount}`),
            width: '20%',
          },
          {
            Header: 'Type',
            accessor: 'type',
            width: '10%',
          },
        ],
        []
      );

    const updatedActivityData = { activityName, selectedDate, status: status.value, budget: budget.toString().replace(/,/g, ""), actual: actual.toString().replace(/,/g, "") };

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(selectedDate);
        Axios.put(`http://localhost:3001/api/updateactivity/${id}`, updatedActivityData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                InsertLogData("Updated Activity Details", auth.firstname);
                toast.success('Activity Updated', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    hideProgressBar: true,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleBudgetChange = (e) => {
        const value = e.target.value;
        const formattedValue = InputCurrency(value);
        setBudget(formattedValue);
    };

    const handleActualChange = (e) => {
        const value = e.target.value;
        const formattedValue = InputCurrency(value);
        setActual(formattedValue);
    };

    return (
        <>
            <div className="contents">
                <div
                    className={`${activeTab === 'activities' ? 'display-content' : 'tab-content '}`}
                    id="contentactivity"
                >
                    <div id="sub-details">
                        <div className="create-forms">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <InputText
                                            label="Name"
                                            id="activity"
                                            type="text"
                                            placeholder="Enter Activity Name"
                                            name="activity"
                                            value={activityName}
                                            onChange={(e) => setActivityName(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12 col-lg-6">
                                        <InputText
                                            label="Code"
                                            id="activityCode"
                                            type="text"
                                            placeholder="Enter Code"
                                            name="activityCode"
                                            value={activityCode}
                                            onChange={(e) => setActivityCode(e.target.value)}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 col-lg-2">
                                        <InputSelection
                                            label="Status"
                                            value={status}
                                            data={statusselection}
                                            onChange={(e) => setStatus(e)}
                                        />
                                    </div>
                                    <div className="col-12 col-lg-3">
                                        <InputTexticon
                                            icon="Php "
                                            label="Budget"
                                            id="budget"
                                            type="text"
                                            placeholder="Enter Budget"
                                            name="budget"
                                            value={budget}
                                            onChange={handleBudgetChange}
                                            required={true}
                                        />
                                    </div>
                                    <div className="col-12 col-lg-3">
                                        <InputTexticon
                                            icon="Php "
                                            label="Actual"
                                            id="actual"
                                            type="text"
                                            placeholder="Enter Actual"
                                            name="actual"
                                            value={actual}
                                            onChange={handleActualChange}
                                            required={true}
                                        />
                                    </div>
                                    <div className="col-12 col-lg-4">
                                        <DatePickerInput
                                            label="Check Date"
                                            selectedDate={selectedDate}
                                            onChange={handleDateChange} />
                                    </div>
                                </div>
                                <div className="button-container">
                                    <button type="submit" className="button-save">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div
                    className={`${activeTab === 'records' ? 'display-content' : 'tab-content '}`}
                    id="contentrecords"
                >
                    <div id="sub-details">
                        <DataTable columns={columns} data={records}/>
                    </div>
                </div>

                {/* <div
                    className={`${activeTab === 'calendar' ? 'display-content' : 'tab-content '}`}
                    id="contentcalendar"
                >
                    <div id="sub-details">
                        <p>Calendar</p>
                    </div>
                </div> */}
            </div>
        </>
    )
}

export default ActivityMenu;