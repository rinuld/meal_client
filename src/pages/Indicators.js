import CreateForm from "../components/CreateForm";
import IndicatorTable from "../components/indicatorComponents.js/IndicatorTable";
import { useContext, useEffect, useState } from "react";
import InputTextArea from "../components/utils/InputTextArea";
import ProjectContext from "../context/ProjectProvider";
import AuthContext from "../context/AuthProvider";
import { InsertLogData } from "../components/InsertLogData";
import { toast } from "react-toastify";

function Indicators() {
    const { auth } = useContext(AuthContext);
    const { project } = useContext(ProjectContext);
    const projectID = project ? project.split('-')[0] : '';
    const [data, setData] = useState([]);

    const [title, setTitle] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            fetch(`http://localhost:3001/api/objectives/${projectID}`)
                .then(response => response.json())
                .then(data => {
                    setData(data);
                })
                .catch(error => {
                    console.log('Error fetching objectives:', error);
                });
        }, 100); // 1 second delay

        return () => clearTimeout(timer); // Cleanup the timer when the component unmounts or when projectID changes
    }, [projectID]);

    const insertObjectiveData = {
        title,
        projectID
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/createObjectives', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(insertObjectiveData),
        })
            .then(response => response.json())
            .then(data2 => {
                const newData = {
                    goalID: data2.goalID,
                    id: data2.outcomeID,
                    title: data2.title
                };
                setData([...data, newData]);
                InsertLogData("Created Objective " + title, auth.firstname);
                toast.success('Objective Saved', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    hideProgressBar: true,
                });
                setTitle("");
            })
            .catch(error => {
                console.log('Error inserting data:', error);
            })
    };

    // const handleDeleteItem = (id) => {
    //     const updatedData = data.filter(item => item.goalID !== id);
    //     setData(updatedData);
    //   };

    console.log('Render Indicator.js');
    return (
        <>
            <CreateForm header="Create Objective">
                <form onSubmit={handleSubmit}>
                    <div className="row gx-3">
                        <div className="col-12 col-md-12">
                            <InputTextArea
                                label="Title"
                                id="title"
                                placeholder="Enter title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="submit" className="button-save isNotDisabled">Save</button>
                    </div>
                </form>
            </CreateForm>
            <IndicatorTable data={data} setData={setData} />
        </>
    )
}

export default Indicators