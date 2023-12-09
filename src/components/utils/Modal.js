import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const ModalComponent = ({ show, handleClose }) => {
  
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Modal content goes here</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
};

export default ModalComponent;
