import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';

const UserTable = () => {
  const [members, setMembers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    // Fetch members data from API
    Axios.get('https://meal-server.negrosanonyoungleaders.org/api/members')
      .then(response => {
        setMembers(response.data);
      })
      .catch(error => {
        console.error('Error fetching members:', error);
        toast.error('Error fetching members');
      });
  }, []);

  const handleDelete = (member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const handleDeleteMember = () => {
    Axios.put(`https://meal-server.negrosanonyoungleaders.org/api/updateDeleteMember/${selectedMember.id}`)
      .then(response => {
        setMembers(prevMembers => prevMembers.filter(member => member.id !== selectedMember.id));
        setShowDeleteModal(false);
        toast.success('Member deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting member:', error);
        toast.error('Error deleting member');
      });
  };

  return (
    <>
    <div className="card-container">
      <div className="card-table">
        <table>
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Name</th>
              <th style={{ width: '15%' }}>Sex</th>
              <th style={{ width: '30%' }}>Email</th>
              <th style={{ width: '20%' }}>Role</th>
              <th style={{ width: '10%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map(member => (
                <tr key={member.id} className='row-theme-1'>
                  <td>{member.firstname} {member.lastname}</td>
                  <td>{member.sex}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>
                    <button  className="button-delete" onClick={() => handleDelete(member)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
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
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete {selectedMember && `${selectedMember.firstname} ${selectedMember.lastname}`}?
          </Modal.Body>
          <Modal.Footer>
            <button onClick={handleDeleteMember} className="button-delete">Delete</button>
            <button onClick={() => setShowDeleteModal(false)} className="button-save">Cancel</button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
    </>
  );
};

export default UserTable;
