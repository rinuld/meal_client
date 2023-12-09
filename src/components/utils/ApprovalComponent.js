import React, { useState } from 'react';

const ApprovalComponent = ({ header, onSign, userName, isApproved, value, onChange }) => {

    return (
        <div className="approval-box">
            <h3>{header}</h3>
            <div className="signature-box" onClick={onSign}>
                {isApproved ? (
                    <span className="signature">Signed by: {userName}</span>
                ) : (
                    <span className="signature-placeholder">Click to Sign</span>
                )}
            </div>
            <div className='person-approval'>
                {header === "PREPARED" ? (
                    <h4>{userName}</h4>) : ("")}
                {header === "CHECKED" ? (
                    <select value={value} onChange={onChange} required placeholder='checked by'>
                        <option value="Finance1">Finance1</option>
                        <option value="Finance2">Finance2</option>
                    </select>) : ("")}
                {header === "APPROVED" ? (
                    <select value={value} onChange={onChange} required placeholder='approved by'>
                        <option value="Kevin Gaitan">Kevin Gaitan</option>
                        <option value="Sample 2">Sample 2</option>
                    </select>) : ("")}
            </div>
        </div>
    );
};

export default ApprovalComponent;
