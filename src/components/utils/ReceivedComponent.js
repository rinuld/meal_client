import React, { useState } from 'react';

const ReceivedComponent = ({ header, onSign, userName, isApproved }) => {

    return (
        <div className="received-box">
            <div className="signature-box" onClick={onSign}>
                {isApproved ? (
                    <span className="signature">Signed by: {userName}</span>
                ) : (
                    <span className="signature-placeholder">Click to Sign</span>
                )}
            </div>
            <div className='person-approval'>
                    <h4>{userName}</h4>
            </div>
        </div>
    );
};

export default ReceivedComponent;
