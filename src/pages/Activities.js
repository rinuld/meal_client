import { useContext, useEffect, useState } from "react";
import ActivityTable from "../components/activityComponents/ActivityTable";
import CreateForm from "../components/CreateForm";
import InputText from "../components/utils/InputText";
import InputTexticon from "../components/utils/InputTextIcon";
import Checker from "../components/Checker";
import ProjectContext from "../context/ProjectProvider";
import DatePickerInput from "../components/DatepickerInput";
import { InsertLogData } from "../components/InsertLogData";
import { toast } from "react-toastify";
import InputCurrency from "../components/utils/InputCurrency";
import AuthContext from "../context/AuthProvider";

function Activity() {
    const { auth } = useContext(AuthContext);
    const { project } = useContext(ProjectContext);
    const projectID = project ? project.split('-')[0] : '';
    const currentDate = new Date();

    const [activityName, setActivityName] = useState("");
    const [activitycode, setActivityCode] = useState("");
    const [budget, setBudget] = useState("");
    const [actDate, setActDate] = useState(currentDate);
    const [activityData, setData] = useState([]);
    const [isActivityCodeExists, setIsActivityCodeExists] = useState(false);
    const [isLoading, setISLoading] = useState(true);

    useEffect(() => {
        // const timer = setTimeout(() => {
            fetch(`http://localhost:3001/api/activities/${projectID}`)
                .then(response => response.json())
                .then(data => {
                    setData(data);
                    setISLoading(false);
                })
                .catch(error => {
                    console.log('Error fetching activity:', error);
                    setISLoading(false);
                });
        // }, 500);

        // return () => clearTimeout(timer);
    }, [projectID]);

    const handleCodeChecker = (value) => {
        setActivityCode(value.target.value);
        const activityCodeExists = activityData.some(row => row.activityID === projectID + "-" + value.target.value);
        setIsActivityCodeExists(activityCodeExists);
    }

    const requestData = {
        actDate,
        activityID: `${projectID}-${activitycode}`,
        activityName,
        budget: budget.toString().replace(/,/g, ""),
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/createActivity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => response.text())
            .then(data => {
                setData([...activityData, { ...requestData, totalCreditAmount: 0 }]);
                InsertLogData("Created Budgetline " + activityName, auth.firstname);
                toast.success('Activity Saved', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    hideProgressBar: true,
                });
                setActDate(currentDate);
                setActivityCode("");
                setActivityName("");
                setBudget("");
            })
            .catch(error => {
                console.log('Error inserting data:', error);
            });
    };

    const handleDateChange = (date) => {
        setActDate(date);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        const formattedValue = InputCurrency(value);
        setBudget(formattedValue);
    };

    console.log('Render Activities.js');
    return (
        <div>
            <CreateForm header="Create Budgetline">
                <form onSubmit={handleSubmit}>
                    <div className="row gx-3">
                        <div className="col-12 col-md-6">
                            <InputTexticon
                                icon={`${projectID} -`}
                                label="Activity Code"
                                id="activitycode"
                                type="text"
                                placeholder="Enter budgetline"
                                name="activitycode"
                                value={activitycode}
                                onChange={handleCodeChecker}
                                required={true}
                            />
                            {activitycode ? <Checker input={`${projectID}-${activitycode}`} tableValues={activityData} column="activityID" /> : ""}
                        </div>
                        <div className="col-12 col-md-6">
                            <InputText
                                label="Activity Name (Budgetline)"
                                id="activityName"
                                type="text"
                                placeholder="Enter budgetline"
                                name="activityName"
                                value={activityName}
                                onChange={(e) => setActivityName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row gx-3">
                        <div className="col-12 col-md-6">
                            <DatePickerInput
                                label="Date"
                                selectedDate={actDate}
                                onChange={handleDateChange} />
                        </div>
                        <div className="col-12 col-md-6">
                            <InputTexticon
                                icon="Php "
                                label="Budget"
                                id="budget"
                                type="text"
                                placeholder="Enter budget"
                                name="budget"
                                value={budget}
                                onChange={handleInputChange}
                                required={true}
                            />
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="submit" className={isActivityCodeExists ? "button-save" : "button-save isNotDisabled"} disabled={isActivityCodeExists}>Save</button>
                    </div>
                </form>
            </CreateForm>
            <ActivityTable activityData={activityData} setActivityData={setData} />
        </div>
    )
}

export default Activity