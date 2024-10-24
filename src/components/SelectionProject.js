import React, { useState, useEffect, useContext } from 'react';
import ProjectContext from '../context/ProjectProvider';

function SelectionProject({ onChange }) {
    // initialize the table content
    const { project, setProject } = useContext(ProjectContext);
    const [projectList, setProjectList] = useState([]);

    // fetch data from the database and assign the value to the setData variable
    useEffect(() => {
        fetch('https://meal-server.negrosanonyoungleaders.org/api/projects')
          .then(response => response.json())
          .then(data => {
            setProjectList(data);
          })
          .catch(error => {
            console.log('Error fetching projects:', error);
          });
      }, []);


    const handleSelect = (event) => {
        onChange(event.target.value);
        setProject(event.target.value);
        localStorage.setItem('selectedProject', event.target.value);
    };

    console.log("Render Selection option");
    return (
        <>
            <div className='card-custom'>
                <select className='textbox' value={project} onChange={handleSelect}>
                    <option hidden disabled>{project}</option>
                    {projectList.map(project => (
                        <option key={project.projectID} value={project.projectID + '-' + project.projectName} style={{height: '2.5em'}}>
                            {project.projectName}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}


export default SelectionProject;