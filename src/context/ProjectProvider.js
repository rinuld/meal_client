import React, { createContext, useState, useEffect } from "react";

const ProjectContext = createContext({});

export const ProjectProvider = ({ children }) => {
    const storedValue = localStorage.getItem('selectedProject');
    const [project, setProject] = useState("");

    // fetch data from the database and assign the value to the setData variable
    useEffect(() => {
        {
            storedValue == null ?
            fetch('https://meal-server.negrosanonyoungleaders.org/api/projects')
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const projectdetails = data[0];
                        setProject(projectdetails.projectID + '-' + projectdetails.projectName);
                    } else {
                        setProject("No Project");
                    }
                })
                .catch(error => {
                    console.log('Error fetching projects:', error);
                }) :
            setProject(storedValue);
        }
    }, []);

    console.log("Render Project Provider");
    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectContext;