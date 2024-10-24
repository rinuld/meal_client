import React from 'react';
import { useContext } from "react";
import '../assets/css/ActivityReportPrint.css';
import logo from '../assets/images/logo.png';
import AuthContext from "../context/AuthProvider";

const ActivityReportPrint = ({ PDFData, activityReportID }) => {

    console.log('PDF DATA:', PDFData);
    const { auth } = useContext(AuthContext);
    const disaggregatedData = PDFData.genderAgeDisabilityData;

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const currentDate = formatDate(new Date());
    const activityDate = formatDate(PDFData.activityDate);

    return (
        <div id="formToPrint">
            <div className="nyli-logo">
                <img src={logo} alt="NYLI"/>
            </div>
            <div className="nyli-logo">
                <div className="col-12">
                    <p><strong>Rapid Post-Activity Report</strong> - {activityReportID}</p>
                </div>     
            </div>

            <br/>
            
            <div className="center">
                <div className="row">
                    <div className="col-6">
                        <p><strong style={{ color: '#106544' }}>Activity Title:</strong> {PDFData.selectedActivity}</p>
                    </div>
                    <div className="col-6">
                        <p><strong style={{ color: '#106544' }}>Project:</strong> {PDFData.selectedProject}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <p><strong style={{ color: '#106544' }}>Date of the Activity:</strong> {activityDate}</p>
                    </div>
                    <div className="col-6">
                        <p><strong style={{ color: '#106544' }}>Location:</strong> {PDFData.location}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <p><strong style={{ color: '#106544' }}>Prepared by:</strong> {auth.firstname} {auth.lastname} </p>
                    </div>
                    <div className="col-6">
                        <p><strong style={{ color: '#106544' }}>Date Prepared:</strong> {currentDate}</p>
                    </div>
                </div>
            </div>

            <br/>

            <div className="center">
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Objective:</strong> {PDFData.selectedObjective}</p>
                </div>
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Outcome:</strong> {PDFData.selectedOutcome}</p>
                </div>
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Output:</strong> {PDFData.selectedOutput}</p>
                </div>
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Indicator:</strong> {PDFData.selectedIndicator}</p>
                </div>
            </div>

            <br/>

            <div className='center'>
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Detailed Description of the Activity:</strong></p>
                    <p>{PDFData.detailedDescription}</p>
                </div>
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Key Outputs and Results:</strong></p>
                    <p>{PDFData.keyOutputs}</p>
                </div>
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Challenges and Obstacles Encountered:</strong></p>
                    <p>{PDFData.challenges}</p>
                </div>
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Lessons Learned:</strong></p>
                    <p>{PDFData.lessons}</p>
                </div>
            </div>

            <div style={{ pageBreakAfter: 'always' }}></div> {/* Page break here */}
            
            <div className="center">
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Institutions and Institutional Groups:</strong></p>
                    <p>{PDFData.selectedInstitutions.join(', ')}</p>
                </div>
            </div>

            <div className="center">
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Gender, Age, and Disability Disaggregated Data</strong></p>
                    {/* Render the table here */}
                    <table className="disaggregated-data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #106544', padding: '10px' }}>Persons Involved</th>
                                <th style={{ border: '1px solid #106544', padding: '10px' }}>Male Participants</th>
                                <th style={{ border: '1px solid #106544', padding: '10px' }}>Female Participants</th>
                                <th style={{ border: '1px solid #106544', padding: '10px' }}>Members of the LGBTQIA+ Community</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disaggregatedData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #106544', padding: '10px' }}>{item.category}</td>
                                    <td style={{ border: '1px solid #106544', padding: '10px' }}>{item.male}</td>
                                    <td style={{ border: '1px solid #106544', padding: '10px' }}>{item.female}</td>
                                    <td style={{ border: '1px solid #106544', padding: '10px' }}>{item.lgbtqia}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ pageBreakAfter: 'always' }}></div> {/* Page break here */}

            <div className="center">
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Success Stories:</strong></p>
                    <p>{PDFData.successStories}</p>
                </div>
            </div>
            <div className="center">
                <div className="row">
                    <p><strong style={{ color: '#106544' }}>Conclusions and Recommendations:</strong></p>
                    <p>{PDFData.conclusions}</p>
                </div>
            </div>
        </div>
    );
};

export default ActivityReportPrint;