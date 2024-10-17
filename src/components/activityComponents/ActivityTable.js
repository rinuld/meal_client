import React, { memo, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import InputCurrency from '../utils/InputCurrency';
import { Modal } from 'react-bootstrap';
import Axios from "axios";
import { toast } from 'react-toastify';
import { InsertLogData } from '../InsertLogData';
import AuthContext from '../../context/AuthProvider';

const ActivityTable = memo(({ activityData, setActivityData }) => {
  const { auth } = useContext(AuthContext);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteData, setSelectedDeleteData] = useState([]);
  const [rowVisible, setRowVisible] = useState(null);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleDelete = (rowData) => {
    setSelectedDeleteData({ rowData });
    setShowDeleteModal(true);
  };

  const handleDeleteItem = (e, id) => {
    e.preventDefault();
    Axios.put(`http://localhost:3001/api/updateDeleteActivity/${id}`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        const activityName = response.data.title;
        setActivityData(prevData => prevData.filter(item => item.id !== id));
        setShowDeleteModal(false);
        InsertLogData("Deleted Activity: " + activityName, auth.firstname);
        toast.success('Activity Deleted', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          hideProgressBar: true,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // console.log(activityData);
  console.log("Activity Table");
  return (
    <>
    <div className="card-container">
      <div className="card-table">
        <table>
          <thead>
            <tr>
              <th style={{ width: '55%' }} onClick={() => handleSort('code')}>Activity</th>
              <th style={{ width: '15%' }}>Status</th>
              <th style={{ width: '10%' }}>Budget</th>
              <th style={{ width: '10%' }}>Actuals</th>
              <th style={{ width: '10%' }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {activityData.length > 0 ? (
              activityData.map((activity) => (
                <tr className='row-theme-1' key={activity.activityID} onMouseEnter={() => setRowVisible(activity.activityID)} onMouseLeave={() => setRowVisible(null)}>
                  <td>
                    <Link to={`/activityDetails/${activity.activityID}`} className='link-text'>
                      <span className='activity-code-txt'> {activity.activityID} - {activity.activityName} </span>
                    </Link>
                  </td>
                  <td>
                    {activity.status}
                  </td>
                  <td>{activity.budget !== undefined ? InputCurrency(activity.budget.toString()) : ''}</td>
                  <td>{activity.actual !== undefined ? InputCurrency(activity.actual.toString()) : ''}</td>
                  <td>
                    <div className='progress-with-button'>
                      <div className='progress-indicator'>
                        {(activity.budget - activity.actual) !== undefined ? InputCurrency((activity.budget - activity.actual).toString()) : ''}
                      </div>
                      <div className='delete-button-container'>
                        {rowVisible === activity.activityID &&
                          <button
                            className="modal-add-button secondary"
                            type="button"
                            onClick={() => handleDelete(activity)}
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
                    <p className='header-modal-title'>Are you sure you want to delete this Activity?</p>
                    <p className='content-modal'>{selectedDeleteData.rowData.activityName}</p>
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
  );
});

export default ActivityTable;
