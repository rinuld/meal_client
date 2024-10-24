import React, { useMemo, useState, useEffect } from 'react';
import DataTable from "../components/DataTable";
import CreateProjectForm from '../components/projectComponents/ProjectForm';
import InputCurrency from "../components/utils/InputCurrency";
import { Link } from 'react-router-dom';
import CreateForm from "../components/CreateForm";

function Projects() {

  // initialize the table content
  const [projectData, setData] = useState([]);

  // fetch data from the database and assign the value to the setData variable
  useEffect(() => {
    fetch('https://meal-server.negrosanonyoungleaders.org/api/projects')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.log('Error fetching projects:', error);
      });
  }, []);

  const handleCreateProject = (newProject) => {
    setData([...projectData, newProject]);
  }

  const handleProjectContext = (projectID) => {
    localStorage.setItem('selectedProject', projectID);
    localStorage.setItem('activeItem', 'Details');
  }


  // setting up the table header and data
  const columns = useMemo(
    () => [
      {
        Header: 'Project ID',
        accessor: 'projectID',
        width: '20%',
      },
      {
        Header: 'Project Name',
        accessor: 'projectName',
        width: '40%',
      },
      {
        Header: 'Budget',
        accessor: row => InputCurrency(`${row.budget}`),
        width: '30%',
      },
      // {
      //   Header: 'Actions',
      //   accessor: 'actions',
      //   width: '10%',
      //   Cell: ({ row }) => (
      //     <Link to={`/details`} value={row.original.projectID} onClick={() => handleProjectContext(row.original.projectID)}>
      //       View
      //     </Link>
      //   ),
      // },
    ],
    []
  );

  console.log('Render Project.js');
  return (
    <>
      <CreateForm header="Add a Project">
        <CreateProjectForm onCreateProject={handleCreateProject} />
      </CreateForm>
      <DataTable columns={columns} data={projectData} />
    </>
  )
}

export default React.memo(Projects);