import { useState, useEffect } from "react";
import InputText from "../utils/InputText";
import Checker from "../Checker";
import { InsertLogData } from "../InsertLogData";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateProjectForm({ onCreateProject }) {
  const [projectName, setProjectName] = useState("");
  const [projectID, setProjectID] = useState("");
  const [refreshData, setRefreshData] = useState(true);
  const [projectData, setData] = useState([]);
  const [isProjectIDExists, setIsProjectIDExists] = useState(false);
  const currentDate = new Date().toISOString();

  // fetch data from the database and assign the value to the setData variable
  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.log('Error fetching projects:', error);
      });
  }, [refreshData]);

  const requestData = {
    projectID,
    projectName,
    startDate: currentDate
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/createProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => response.json())
      .then(data => {
        onCreateProject(data);
        console.log(data)
        setRefreshData(!setRefreshData);
        InsertLogData("Created Project " + projectName);
        toast.success('Project Saved', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
        });
        setProjectID("");
        setProjectName("");
      })
      .catch(error => {
        console.log('Error inserting data:', error);
      });
  };

  const handleCodeChecker = (value) => {
    setProjectID(value.target.value);
    const projectIDExists = projectData.some(row => row.projectID === value.target.value);
    setIsProjectIDExists(projectIDExists);
  }

  // console.log(projectData);
  console.log("Render Project Form");
  return (
    <>
      <div className="create-forms">
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
                onChange={handleCodeChecker}
              />
              {projectID ? <Checker input={projectID} tableValues={projectData} column="projectID" /> : ""}
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
          <div className="button-container">
            <button type="submit" className={isProjectIDExists ? "button-save" : "button-save isNotDisabled"} disabled={isProjectIDExists}>Save</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateProjectForm