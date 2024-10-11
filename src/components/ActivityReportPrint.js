import React from 'react';
import '../assets/css/ActivityReportPrint.css';
import logo from '../assets/images/logo.png';

const ActivityReportPrint = ({ PDFData, activityReportID }) => {

    console.log('PDF DATA:', PDFData);

    const disaggregatedData = PDFData.genderAgeDisabilityData;

    const formatDate = (date) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const currentDate = formatDate(new Date());

    return (
        <div id="formToPrint">
            <div className="voucher-nyli-logo">
                <img src={logo} alt="NYLI" />
                <div className="right-title">
                    <h3>Activity Report</h3>
                    <p>{activityReportID} - {currentDate}</p>
                </div>
            </div>

            <br />
            <div className="row gx-3">
                <div className="col-6">
                    <p><strong style={{ color: '#106544' }}>Project:</strong> {PDFData.selectedProject}</p>
                </div>
                <div className="col-6">
                    <p><strong style={{ color: '#106544' }}>Activity:</strong> {PDFData.selectedActivity}</p>
                </div>
            </div>

            <div className="row gx-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Objective:</strong> {PDFData.selectedObjective}</p>
                </div>
            </div>
            <div className="row gx-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Outcome:</strong> {PDFData.selectedOutcome}</p>
                </div>
            </div>
            <div className="row gx-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Output:</strong> {PDFData.selectedOutput}</p>
                </div>
            </div>
            <div className="row gx-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Indicator:</strong> {PDFData.selectedIndicator}</p>
                </div>
            </div>

            <br />
            <div className="row gx-3 mb-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Institutions and Institutional Groups</strong></p>
                    <p>{PDFData.selectedInstitutions.join(', ')}</p>
                </div>
            </div>
            <div className="row gx-3 mb-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Gender, Age, and Disability Disaggregated Data</strong></p>
                    {/* Render the table here */}
                    <table className="disaggregated-data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #000', padding: '8px' }}>Persons Involved</th>
                                <th style={{ border: '1px solid #000', padding: '8px' }}>Male Participants</th>
                                <th style={{ border: '1px solid #000', padding: '8px' }}>Female Participants</th>
                                <th style={{ border: '1px solid #000', padding: '8px' }}>Members of the LGBTQIA+ Community</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disaggregatedData.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ border: '1px solid #000', padding: '8px' }}>{item.category}</td>
                                    <td style={{ border: '1px solid #000', padding: '8px' }}>{item.male}</td>
                                    <td style={{ border: '1px solid #000', padding: '8px' }}>{item.female}</td>
                                    <td style={{ border: '1px solid #000', padding: '8px' }}>{item.lgbtqia}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ pageBreakAfter: 'always' }}></div> {/* Page break here */}

            <br />
            <div className="row gx-3 mb-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Detailed Description of the Activity:</strong></p>
                    <p>{PDFData.detailedDescription}</p>
                </div>
            </div>
            <div className="row gx-3 mb-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Key Outputs and Results:</strong></p>
                    <p>{PDFData.keyOutputs}</p>
                </div>
            </div>
            <div className="row gx-3 mb-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Challenges and Lessons Learned:</strong></p>
                    <p>{PDFData.challenges}</p>
                </div>
            </div>
            <div className="row gx-3 mb-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Success Stories:</strong></p>
                    <p>{PDFData.successStories}</p>
                </div>
            </div>
            <div className="row gx-3 mb-3">
                <div className="col-12">
                    <p><strong style={{ color: '#106544' }}>Conclusions and Recommendations:</strong></p>
                    <p>{PDFData.conclusions}</p>
                </div>
            </div>
        </div>
    );
};

export default ActivityReportPrint;
