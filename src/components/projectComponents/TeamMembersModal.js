import Axios from 'axios';
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import '../../assets/css/TeamMembersModal.css';

function TeamMembersModal({ show, onClose, onSave }) {
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch members from the updated endpoint
        Axios.get('http://localhost:3001/api/addProjMember')
            .then(response => {
                console.log('Fetched members:', response.data); // Log the response
                setMembers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                toast.error('Error fetching users');
            });
    }, []);

    const handleSelectMember = (memberName) => {
        setSelectedMembers(prev => {
            if (prev.includes(memberName)) {
                return prev.filter(m => m !== memberName);
            } else {
                return [...prev, memberName];
            }
        });
    };

    // Combine first name and last name for display
    const filteredMembers = members.filter(member => 
        (member.firstname && member.lastname) &&
        (`${member.firstname} ${member.lastname}`).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = () => {
        onSave(selectedMembers);
        onClose();
    };

    return (
        <Modal className="modal"show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Team Members</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input 
                    type="text" 
                    placeholder="Search members..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="form-control mb-3"
                />
                <div className="list-group">
                    {filteredMembers.map(member => {
                        const memberName = `${member.firstname} ${member.lastname}`; // Combine names
                        const isChecked = selectedMembers.includes(memberName); // Check if selected
                        return (
                            <label key={member.id} className="list-group-item">
                                {memberName}
                                <div 
                                    className={`checkbox-circle ${isChecked ? 'checked' : ''}`} 
                                    onClick={() => handleSelectMember(memberName)} // Handle click to toggle selection
                                />
                            </label>
                        );
                    })}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <button className="button-save" onClick={handleSave}>Save</button>
            </Modal.Footer>
        </Modal>
    );
}

export default TeamMembersModal;
