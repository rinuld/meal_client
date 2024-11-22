import React, { useState, useContext, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import CreateProjectForm from '../components/projectComponents/ProjectForm';
import InputCurrency from "../components/utils/InputCurrency";
import Axios from "axios";
import CreateForm from "../components/CreateForm";
import AuthContext from '../context/AuthProvider';
import { InsertLogData } from "../components/InsertLogData";
import { toast } from 'react-toastify';

function Projects() {

  // initialize the table content
  const { auth } = useContext(AuthContext);
  const [projectData, setData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowVisible, setRowVisible] = useState(null);
  const [selectedDeleteData, setSelectedDeleteData] = useState([]);

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
  }, []);

  const handleCreateProject = (newProject) => {
    setData([...projectData, newProject]);
  }

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = (rowData) => {
    setSelectedDeleteData({ rowData });
    setShowDeleteModal(true);
  };

  const handleDeleteItem = (e, id) => {
    e.preventDefault();
    Axios.put(`http://localhost:3001/api/updateDeleteProject/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const projectName = response.data.title;
        setShowDeleteModal(false);
        InsertLogData("Deleted Project: " + projectName, auth.firstname);
        toast.success('Project Deleted', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          hideProgressBar: true,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleProjectContext = (projectID) => {
    localStorage.setItem('selectedProject', projectID);
    localStorage.setItem('activeItem', 'Details');
  }

  console.log('Render Project.js');
  return (
    <>
      <CreateForm header="Add a Project">
        <CreateProjectForm onCreateProject={handleCreateProject} />
      </CreateForm>

      <div className="card-container">
        <div className="card-table">
          <table>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Project ID</th>
                <th style={{ width: '45%' }}>Project Name</th>
                <th style={{ width: '30%' }}>Budget</th>
              </tr>
            </thead>
            <tbody>
              {projectData.length > 0 ? (
                projectData.map((project) => (
                  <tr className='row-theme-1' key={project.projectID} onMouseEnter={() => setRowVisible(project.projectID)} onMouseLeave={() => setRowVisible(null)}>
                    <td>
                      {project.projectID}
                    </td>
                    <td>
                      {project.projectName}
                    </td>
                    <td>
                      <div className='progress-with-button'>
                        <div className='progress-indicator'>
                          {project.budget !== undefined ? InputCurrency(project.budget.toString()) : ''}
                        </div>
                        <div className='delete-button-container'>
                          {rowVisible === project.projectID &&
                            <button
                              className="modal-add-button secondary"
                              type="button"
                              onClick={() => handleDelete(project)}
                              style={{ marginLeft: '1rem' }}
                            >
                              <i className="fa fa-trash btn-add"></i>
                            </button>
                          }
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">
                    <div className='empty-table-data'>
                      <p>No Data Available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {showDeleteModal && (
          <Modal className='d-flex align-items-center justify-content-center' show={showDeleteModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Please Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='modal-form'>
                <form onSubmit={(e) => handleDeleteItem(e, (selectedDeleteData.rowData).id)}>
                  <div className='row'>
                    <div className='delete-modal'>
                      <p className='header-modal-title'>Are you sure you want to delete this Project?</p>
                      <p className='content-modal'>{selectedDeleteData.rowData.projectName}</p>
                    </div>
                    <div className="button-container text-center">
                      <button type="submit" className="button-delete put-center">Delete</button>
                    </div>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </>
  )
}

export default React.memo(Projects);