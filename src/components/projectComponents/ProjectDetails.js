import { useState, useEffect, memo, useContext } from "react";
import { useParams } from "react-router-dom";
import PieChart from "./PieChart";
import InputText from "../utils/InputText";
import Axios from 'axios';
import { InsertLogData } from "../InsertLogData";
import { toast } from 'react-toastify';
import InputSelection from "../utils/InputSelection";
import InputTexticon from "../utils/InputTextIcon";
import DatePickerInput from "../DatepickerInput";
import CreateForm from "../CreateForm";
import InputCurrency from "../utils/InputCurrency";
import AuthContext from "../../context/AuthProvider";

const ProjectDetails = memo(({ projectID }) => {
    const { auth } = useContext(AuthContext);
    const currentDate = new Date();
    const { id } = useParams();
    const [projectName, setProjectName] = useState("");
    const [setProjectID] = useState(projectID);
    const [status, setStatus] = useState({});
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState(0);
    const [expenses, setExpenses] = useState(0);

    // For budget details
    const [addBudget, setAddBudget] = useState(0);
    const [source, setSource] = useState("");
    const [date, setDate] = useState(currentDate);

    // Get Details of a specific project
    useEffect(() => {
        Axios.get(`http://localhost:3001/api/projectDetails/${projectID}`)
            .then(response => {
                // console.log(response.data);
                const projectData = response.data;
                setBudget(projectData.budget);
                setProjectName(projectData.projectName);
                setStatus({ value: projectData.status, label: projectData.status });
                setDescription(projectData.description);
            })
            .catch(error => {
                console.log('Error fetching project details:', error);
            });
    }, [projectID]);

    useEffect(() => {
        fetch(`http://localhost:3001/api/getExpenses/${projectID}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                if(data.length==0){
                    setExpenses(0);
                }else{
                    const totalExpenses = data.reduce((total, item) => total + parseFloat(item.amount), 0);
                    setExpenses(totalExpenses);
                    console.log(totalExpenses);
                }
            })
            .catch(error => {
                console.log('Error fetching expenses details:', error);
            });
    }, [projectID]);

    const updatedProjectData = { projectName, status: status.value, description };
    const addBudgetData = { amount: addBudget.toString().replace(/,/g, ""), source, date, projectID };

    const statusselection = [
        { value: 'Ongoing', label: 'Ongoing' },
        { value: 'Cancelled', label: 'Cancelled' },
        { value: 'Completed', label: 'Completed' },
        { value: 'Delayed', label: 'Delayed' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'On Hold', label: 'On Hold' },
        { value: 'Under Review', label: 'Under Review' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.put(`http://localhost:3001/api/updateproject/${projectID}`, updatedProjectData, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                InsertLogData("Updated Project Details of Project Code " + projectID, auth.firstname);
                toast.success('Project Updated', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    hideProgressBar: true,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleAddBudget = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/createBudget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addBudgetData),
        })
            .then(response => response.json())
            .then(data => {
                InsertLogData("Added a budget on " + projectID, auth.firstname);
                toast.success('Budget succesfully added!', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    hideProgressBar: true,
                });
                setBudget(budget+parseFloat(addBudget.toString().replace(/,/g, "")));
                setAddBudget(0);
                setSource("");
                setDate(currentDate);
            })
            .catch(error => {
                console.log('Error inserting data:', error);
            });
    }

    console.log("Render Project Details");
    return (
        <>
            <div className="row">
                <div className="col-8">
                    <div className="create-forms">
                        {/* <p>{id}</p> */}
                        <form onSubmit={handleSubmit}>
                            <div className="row gx-3">
                                <div className="col-12 col-md-6">
                                    <InputText
                                        label="Project ID"
                                        id="newprojectID"
                                        type="number"
                                        placeholder="Enter project ID"
                                        name="newprojectID"
                                        value={projectID}
                                        onChange={(e) => setProjectID(e.target.value)}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <InputText
                                        label="Project Name"
                                        id="newprojectName"
                                        type="text"
                                        placeholder="Enter project name"
                                        name="newprojectName"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row gx-3">
                                <div className="col-12 col-md-6">
                                    <InputSelection
                                        label="Status"
                                        value={status}
                                        data={statusselection}
                                        onChange={(e) => setStatus(e)}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <InputText
                                        label="Description"
                                        id="description"
                                        type="text"
                                        placeholder="Enter description"
                                        name="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="button-container">
                                <button type="submit" className="button-save isNotDisabled">Save</button>
                            </div>
                        </form>
                    </div>
                    <CreateForm header="Add Budget" className="modal-header">
                        <form onSubmit={handleAddBudget}>
                            <div className="row gx-3">
                                <div className="col-12 col-md-6">
                                    <InputText
                                        label="Source (Partner)"
                                        id="source"
                                        type="text"
                                        placeholder="Enter source"  
                                        name="source"
                                        value={source}
                                        onChange={(e) => setSource(e.target.value)}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <InputTexticon
                                        icon="Php "
                                        label="Amount"
                                        id="amount"
                                        type="text"
                                        placeholder="enter amount"
                                        name="amount"
                                        value={addBudget}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const formattedValue = InputCurrency(value);
                                            setAddBudget(formattedValue);
                                        }}
                                        required={true}
                                    />
                                </div>
                            </div>
                            <div className="row form-rows gx-3">
                                <div className="col-12 col-md-6">
                                    <DatePickerInput
                                        label="Date"
                                        selectedDate={date}
                                        onChange={(e) => setDate(e)} />
                                </div>
                                <div className="col-12 col-md-6">
                                 
                                </div>
                            </div>
                            <div className="button-container">
                                <button type="submit" className="button-save isNotDisabled">Save</button>
                            </div>
                        </form>
                    </CreateForm>
                </div>
                <div className="col-4">
                    <div className="create-forms">
                        <PieChart expenses={parseFloat(expenses)} totalbudget={parseFloat(budget)} />
                    </div>
                </div>
            </div>
        </>
    )
})

export default ProjectDetails