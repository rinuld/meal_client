import { useContext, useState, useEffect } from "react";
import Axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputSelection from "../components/utils/InputSelection";
import InputText from "../components/utils/InputText";
import ActivityReportPrint from '../components/ActivityReportPrint';
import '../assets/css/ActivityReport.css';
import '../assets/css/SaveToast.css';
import html2pdf from 'html2pdf.js';
import AuthContext from "../context/AuthProvider";
import { InsertLogData } from "../components/InsertLogData";
import DatePicker from "react-datepicker";

function ActivityReport() {
    const initialState = {
        selectedProject: null,
        selectedActivity: null,
        selectedObjective: null,
        selectedOutcome: null,
        selectedOutput: null,
        selectedIndicator: null,
        selectedInstitutions: [],
        location: "",
        otherInstitution: "",
        detailedDescription: "",
        keyOutputs: "",
        challenges: "",
        lessons: "",
        successStories: "",
        conclusions: "",
        genderAgeDisabilityData: {
            children: { male: '', female: '', lgbtqia: '' },
            youth: { male: '', female: '', lgbtqia: '' },
            adults: { male: '', female: '', lgbtqia: '' },
            indigenousPeople: { male: '', female: '', lgbtqia: '' },
            outOfSchoolYouth: { male: '', female: '', lgbtqia: '' },
            peoplesOrgRep: { male: '', female: '', lgbtqia: '' },
            internallyDisplacedPersons: { male: '', female: '', lgbtqia: '' },
            pwd: { male: '', female: '', lgbtqia: '' },
            dutyBearer: { male: '', female: '', lgbtqia: '' },
            others: { male: '', female: '', lgbtqia: '', specification: '' },
            total: { male: 0, female: 0, lgbtqia: 0 }
        }
    };

    const { auth } = useContext(AuthContext);
    const [activityDate, setActivityDate] = useState(new Date());
    const [formData, setFormData] = useState(initialState);
    const [PDFData, setPDFData] = useState(null);
    const [PDFActivityReportID, setPDFActivityReportID] = useState(null);
    const formattedDate = activityDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const [selections, setSelections] = useState({
        projects: [],
        activities: [],
        objectives: [],
        outcomes: [],
        outputs: [],
        indicators: []
    });

    const institutions = [
        "Academe",
        "Representatives of NGOs",
        "Representatives of Political Parties",
        "Youth, Youth-Serving, Youth-led Organizations",
        "Local Government Units",
        "Government Officials",
        "Religious Institutions",
    ];

    useEffect(() => {
        Axios.get('http://localhost:3001/api/projects')
            .then(response => {
                const formattedProjects = formatProjects(response.data);
                setSelections(prev => ({ ...prev, projects: formattedProjects }));
            })
            .catch(error => handleApiError(error, 'Error fetching projects'));
    }, []);

    const formatProjects = (projects) => {
        return projects.map(project => ({
            value: project.projectID,
            label: project.projectName
        }));
    };

    const handleApiError = (error, defaultMessage) => {
        const errorMessage = error.response?.data?.message || defaultMessage;
        toast.error(errorMessage);
        console.error(errorMessage);
    };

    const handleProjectChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            selectedProject: selectedOption,
            selectedActivity: null,
            selectedObjective: null,
            selectedOutcome: null,
            selectedOutput: null,
            selectedIndicator: null
        }));

        Axios.get(`http://localhost:3001/api/activities/${selectedOption.value}`)
            .then(response => {
                const formattedActivities = [
                    { value: "N/A", label: "N/A" },
                    ...formatData(response.data, 'activityID', 'activityName'),
                ];
                setSelections(prev => ({ ...prev, activities: formattedActivities }));
            })
            .catch(error => handleApiError(error, 'Error fetching activities'));

        Axios.get(`http://localhost:3001/api/objectives/${selectedOption.value}`)
            .then(response => {
                const formattedObjectives = [
                    { value: "N/A", label: "N/A" },
                    ...formatData(response.data, 'goalID', 'title'),
                ];
                setSelections(prev => ({ ...prev, objectives: formattedObjectives }));
            })
            .catch(error => handleApiError(error, 'Error fetching objectives'));
    };

    const handleActivityChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            selectedActivity: selectedOption,
            selectedObjective: null,
            selectedOutcome: null,
            selectedOutput: null,
            selectedIndicator: null
        }));
    };

    const handleObjectiveChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            selectedObjective: selectedOption,
            selectedOutcome: null,
            selectedOutput: null,
            selectedIndicator: null
        }));

        Axios.get(`http://localhost:3001/api/outcomes/${selectedOption.value}`)
            .then(response => {
                const formattedOutcomes = response.data.length > 0
                    ? [{ value: "N/A", label: "N/A" }, ...formatData(response.data, 'outcomeID', 'title')]
                    : [{ value: "N/A", label: "N/A" }];
                setSelections(prev => ({ ...prev, outcomes: formattedOutcomes }));
                setSelections(prev => ({
                    ...prev,
                    outputs: [{ value: "N/A", label: "N/A" }],
                    indicators: [{ value: "N/A", label: "N/A" }],
                }));
            })
            .catch(() => {
                setSelections(prev => ({
                    ...prev,
                    outcomes: [{ value: "N/A", label: "N/A" }],
                    outputs: [{ value: "N/A", label: "N/A" }],
                    indicators: [{ value: "N/A", label: "N/A" }],
                }));
            });
    };

    const handleOutcomeChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            selectedOutcome: selectedOption,
            selectedOutput: null,
            selectedIndicator: null
        }));

        Axios.get(`http://localhost:3001/api/outputs/${selectedOption.value}`)
            .then(response => {
                const formattedOutputs = response.data.length > 0
                    ? [{ value: "N/A", label: "N/A" }, ...formatData(response.data, 'outputID', 'title')]
                    : [{ value: "N/A", label: "N/A" }];
                setSelections(prev => ({ ...prev, outputs: formattedOutputs }));
                setSelections(prev => ({
                    ...prev,
                    indicators: [{ value: "N/A", label: "N/A" }],
                }));
            })
            .catch(() => {
                setSelections(prev => ({
                    ...prev,
                    outputs: [{ value: "N/A", label: "N/A" }],
                    indicators: [{ value: "N/A", label: "N/A" }],
                }));
            });
    };

    const handleOutputChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            selectedOutput: selectedOption,
            selectedIndicator: null
        }));

        Axios.get(`http://localhost:3001/api/indicators/${selectedOption.value}`)
            .then(response => {
                const formattedIndicators = response.data.length > 0
                    ? [{ value: "N/A", label: "N/A" }, ...formatData(response.data, 'indicatorID', 'indicator')]
                    : [{ value: "N/A", label: "N/A" }];
                setSelections(prev => ({ ...prev, indicators: formattedIndicators }));
            })
            .catch(() => {
                setSelections(prev => ({
                    ...prev,
                    indicators: [{ value: "N/A", label: "N/A" }],
                }));
            });
    };

    const handleIndicatorChange = (selectedOption) => {
        setFormData(prev => ({ ...prev, selectedIndicator: selectedOption }));
    };

    const handleInstitutionChange = (institution) => {
        setFormData(prev => {
            const selectedInstitutions = prev.selectedInstitutions.includes(institution)
                ? prev.selectedInstitutions.filter(i => i !== institution)
                : [...prev.selectedInstitutions, institution];
            return { ...prev, selectedInstitutions };
        });
    };

    const handleOtherInstitutionChange = (value) => {
        setFormData(prev => ({ ...prev, otherInstitution: value }));
    };

    const clearForm = () => {
        setFormData(initialState);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const formatData = (data, valueKey, labelKey) => {
        return data.map(item => ({
            value: item[valueKey],
            label: item[labelKey]
        }));
    };

    const handleGenderAgeDisabilityChange = (category, field, value) => {
        // Allow empty input for 'others'
        if (category === 'others') {
            setFormData(prev => ({
                ...prev,
                genderAgeDisabilityData: {
                    ...prev.genderAgeDisabilityData,
                    [category]: {
                        ...prev.genderAgeDisabilityData[category],
                        [field]: value // Directly assign the text value
                    }
                }
            }));
            return;
        }
    
        // For other categories, continue with number handling
        if (value === '') value = ''; // Allow empty input for now
        else value = Math.max(0, Math.floor(Number(value))); // Round and ensure non-negative
    
        setFormData(prev => {
            const newData = {
                ...prev,
                genderAgeDisabilityData: {
                    ...prev.genderAgeDisabilityData,
                    [category]: {
                        ...prev.genderAgeDisabilityData[category],
                        [field]: value
                    }
                }
            };
    
            // Update total when children, youth, or adults are updated
            if (['children', 'youth', 'adults'].includes(category)) {
                newData.genderAgeDisabilityData.total = calculateTotal(newData.genderAgeDisabilityData);
            }
    
            return newData;
        });
    };
    
    const calculateTotal = (data) => {
        const total = { male: 0, female: 0, lgbtqia: 0 };

        ['children', 'youth', 'adults'].forEach(category => {
            total.male += Number(data[category].male) || 0;
            total.female += Number(data[category].female) || 0;
            total.lgbtqia += Number(data[category].lgbtqia) || 0;
        });

        return total;
    };

    const prepareDataForSubmission = (data) => {
        const preparedData = { ...data };
        Object.keys(preparedData.genderAgeDisabilityData).forEach(category => {
            const fields = preparedData.genderAgeDisabilityData[category];
            Object.keys(fields).forEach(field => {
                if (fields[field] === '' || fields[field] === null) {
                    preparedData.genderAgeDisabilityData[category][field] = 0;
                }
            });
        });
        return preparedData;
    };

    const normalizeData = (data) => {
        return {
            category: data.category,
            male: data.male ?? 0,     
            female: data.female ?? 0, 
            lgbtqia: data.lgbtqia ?? 0
        };
    };

    // Display success message with options
    const showSuccessPopup = (activityReportID) => {
        toast(
            ({ closeToast }) => (
            <div className="popup-container">
                <p>Activity Report submitted successfully!</p>
                <div className="button-group">          
                    <button className="button-create" onClick={() => handleDownload(activityReportID, closeToast)}>Download as PDF</button>
                    <button className="button-save" onClick={closeToast}>Close</button>
                </div>
            </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
                position: 'top-right',
                hideProgressBar: true,
                closeButton: false,
            }
        );
    };
    
    // Download form as PDF

    const handleDownload = (activityReportID, closeToast) => {
        console.log("Downloading PDF...");
        const elementToPrint = document.getElementById('formToPrint');
    
        // Options for html2pdf
        const options = {
            margin:       0.5,
            filename:     `${activityReportID}.pdf`, // Use the activity report ID as filename
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { scale: 1.5 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    
        // Generate PDF
        html2pdf()
            .from(elementToPrint)
            .set(options)
            .save()
            .then(() => {
                closeToast();
                clearForm();
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Prepare data for submission
        const preparedData = prepareDataForSubmission(formData);
        const updatedInstitutions = formData.otherInstitution.trim() 
            ? [...formData.selectedInstitutions, formData.otherInstitution] 
            : formData.selectedInstitutions;
    
        // Validation for required fields
        const requiredFields = [
            formData.selectedProject,
            formData.selectedActivity,
            formData.selectedObjective,
            formData.selectedOutcome,
            formData.selectedOutput,
            formData.selectedIndicator,
            preparedData.location,
            preparedData.detailedDescription,
            preparedData.keyOutputs,
            preparedData.challenges,
            preparedData.lessons,
            preparedData.successStories,
            preparedData.conclusions
        ];
    
        // Check if all required fields are filled
        const allRequiredFilled = requiredFields.every(field => field !== null && field !== '' && field !== undefined);
    
        // Check if at least one institution is selected or 'Others' field is filled
        const institutionsChecked = updatedInstitutions.length > 0;
    
        if (!allRequiredFilled) {
            toast.error("Please fill in all required fields.");
            return;
        }
    
        if (!institutionsChecked) {
            toast.error("Please select at least one institution or specify 'Others'.");
            return;
        }

        const genderAgeDisabilityData = [
            normalizeData({ category: 'Children', male: formData.genderAgeDisabilityData.children.male, female: formData.genderAgeDisabilityData.children.female, lgbtqia: formData.genderAgeDisabilityData.children.lgbtqia}),
            normalizeData({ category: 'Youth', male: formData.genderAgeDisabilityData.youth.male, female: formData.genderAgeDisabilityData.youth.female, lgbtqia: formData.genderAgeDisabilityData.youth.lgbtqia}),
            normalizeData({ category: 'Adults', male: formData.genderAgeDisabilityData.adults.male, female: formData.genderAgeDisabilityData.adults.female, lgbtqia: formData.genderAgeDisabilityData.adults.lgbtqia}),
            normalizeData({ category: 'Indigenous People', male: formData.genderAgeDisabilityData.indigenousPeople.male, female: formData.genderAgeDisabilityData.indigenousPeople.female, lgbtqia: formData.genderAgeDisabilityData.indigenousPeople.lgbtqia}),
            normalizeData({ category: 'Out-of-School Youth', male: formData.genderAgeDisabilityData.outOfSchoolYouth.male, female: formData.genderAgeDisabilityData.outOfSchoolYouth.female, lgbtqia: formData.genderAgeDisabilityData.outOfSchoolYouth.lgbtqia}),
            normalizeData({ category: "People's Organization Representative", male: formData.genderAgeDisabilityData.peoplesOrgRep.male, female: formData.genderAgeDisabilityData.peoplesOrgRep.female, lgbtqia: formData.genderAgeDisabilityData.peoplesOrgRep.lgbtqia}),
            normalizeData({ category: 'Internally Displaced Person', male: formData.genderAgeDisabilityData.internallyDisplacedPersons.male, female: formData.genderAgeDisabilityData.internallyDisplacedPersons.female, lgbtqia: formData.genderAgeDisabilityData.internallyDisplacedPersons.lgbtqia}),
            normalizeData({ category: 'Persons with Disabilities', male: formData.genderAgeDisabilityData.pwd.male, female: formData.genderAgeDisabilityData.pwd.female, lgbtqia: formData.genderAgeDisabilityData.pwd.lgbtqia}),
            normalizeData({ category: 'Duty Bearer', male: formData.genderAgeDisabilityData.dutyBearer.male, female: formData.genderAgeDisabilityData.dutyBearer.female, lgbtqia: formData.genderAgeDisabilityData.dutyBearer.lgbtqia}),
        ];

        if (formData.genderAgeDisabilityData.others.specification && formData.genderAgeDisabilityData.others.specification.trim() !== '') {
            genderAgeDisabilityData.push(
                normalizeData({
                    category: formData.genderAgeDisabilityData.others.specification,
                    male: formData.genderAgeDisabilityData.others.male,
                    female: formData.genderAgeDisabilityData.others.female,
                    lgbtqia: formData.genderAgeDisabilityData.others.lgbtqia
                })
            );
        }
    
        // Prepare the data to be sent in the POST request
        const dataToPost = {
            selectedProject: formData.selectedProject.label,
            selectedActivity: formData.selectedActivity.label,
            activityDate: formattedDate,
            location: preparedData.location,
            selectedObjective: formData.selectedObjective.label,
            selectedOutcome: formData.selectedOutcome.label,
            selectedOutput: formData.selectedOutput.label,
            selectedIndicator: formData.selectedIndicator.label,
            selectedInstitutions: updatedInstitutions,
            genderAgeDisabilityData,
            detailedDescription: preparedData.detailedDescription,
            keyOutputs: preparedData.keyOutputs,
            challenges: preparedData.challenges,
            lessons: preparedData.lessons,
            successStories: preparedData.successStories,
            conclusions: preparedData.conclusions
        };

        console.log(dataToPost);
    
        // Post the data to the server
        Axios.post('http://localhost:3001/api/addActivityReport', dataToPost)
            .then(response => {
                const { activityReportID } = response.data;
                showSuccessPopup(activityReportID);
                setPDFData(dataToPost);
                setPDFActivityReportID(activityReportID);
                InsertLogData("Added an Activity Report", auth.firstname);
                clearForm(); // Clear the form after successful submission
            })
            .catch(error => {
                toast.error('Error submitting Activity Report');
            });
    };

    const InstitutionCheckboxes = ({ institutions, selectedInstitutions, handleInstitutionChange }) => (
        <>
            {institutions.map((institution, index) => (
                <div className="col-6" key={index}>
                    <div className="form-check arForm">
                        <input
                            type="checkbox"
                            id={institution}
                            className="form-check-input"
                            checked={selectedInstitutions.includes(institution)}
                            onChange={() => handleInstitutionChange(institution)}
                        />
                        <label htmlFor={institution} className="form-check-label">{institution}</label>
                    </div>
                </div>
            ))}
        </>
    );

    const renderGenderAgeDisabilityTable = () => {
        const categories = [
            { key: 'children', label: 'Children (Below 18)' },
            { key: 'youth', label: 'Youth (18-35 Yrs Old)' },
            { key: 'adults', label: 'Adults (Above 35)' },
            { key: 'totals', label: 'Total' },
            { key: 'indigenousPeople', label: 'Indigenous People' },
            { key: 'outOfSchoolYouth', label: 'Out-of-School Youth' },
            { key: 'peoplesOrgRep', label: 'People’s Organization Representative (Farmers, Fisherfolk, etc.)' },
            { key: 'internallyDisplacedPersons', label: 'Internally Displaced Person (IDP)' },
            { key: 'pwd', label: 'Persons with Disabilities (PWD)' },
            { key: 'dutyBearer', label: 'Duty Bearer (Community Leader, Gov’t Official, etc.)' },
            { key: 'others', label: 'Others, please specify:' }
        ];
    
        return (
            <table className="table table-bordered gender-age-disability-table">
                <thead>
                    <tr>
                        <th><label>Persons Involved</label></th>
                        <th><label>Male Participants</label></th>
                        <th><label>Female Participants</label></th>
                        <th><label>Members of the LGBTQIA+ Community</label></th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => {
                        if (category.key === 'totals') {
                            return (
                                <tr key={category.key}>
                                    <td><label><strong>Total</strong></label></td>
                                    <td><label><strong>{formData.genderAgeDisabilityData.total.male}</strong></label></td>
                                    <td><label><strong>{formData.genderAgeDisabilityData.total.female}</strong></label></td>
                                    <td><label><strong>{formData.genderAgeDisabilityData.total.lgbtqia}</strong></label></td>
                                </tr>
                            );
                        } else {
                            return (
                                <tr key={category.key}>
                                    <td>
                                        {category.key === 'others' ? (
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={category.label}
                                                value={formData.genderAgeDisabilityData[category.key].specification}
                                                onChange={e => handleGenderAgeDisabilityChange(category.key, 'specification', e.target.value)}
                                            />
                                        ) : (
                                            <label>{category.label}</label>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.genderAgeDisabilityData[category.key].male}
                                            onChange={e => handleGenderAgeDisabilityChange(category.key, 'male', e.target.value)}
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.genderAgeDisabilityData[category.key].female}
                                            onChange={e => handleGenderAgeDisabilityChange(category.key, 'female', e.target.value)}
                                            min="0"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={formData.genderAgeDisabilityData[category.key].lgbtqia}
                                            onChange={e => handleGenderAgeDisabilityChange(category.key, 'lgbtqia', e.target.value)}
                                            min="0"
                                        />
                                    </td>
                                </tr>
                            );
                        }
                    })}
                </tbody>
            </table>
        );
    };
    

    return (
        <div className="create-forms">
            <form id="activityReportForm" onSubmit={handleSubmit}>
                <div className="row gx-3">
                    <div className="col-3">
                        <InputSelection
                            label="Project"
                            value={formData.selectedProject}
                            data={selections.projects}
                            onChange={handleProjectChange}
                        />
                    </div>
                    <div className="col-3">
                        <InputSelection
                            label="Activity"
                            value={formData.selectedActivity}
                            data={selections.activities}
                            onChange={handleActivityChange}
                        />
                    </div>
                    <div className="col-3">
                        <InputText
                            label="Location"
                            id="location"
                            type="text"
                            placeholder="Enter Activity Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="col-3">
                        <label htmlFor="Birthdate">Date of the Activity</label><br></br>
                        <DatePicker
                            className='input-text'
                            selected={activityDate}
                            onChange={(date) => setActivityDate(date)}
                            dateFormat="yyyy/MM/dd"
                        />
                    </div>
                </div>
                <div className="row gx-3">
                    <div className="col-3">
                        <InputSelection
                            label="Objective"
                            value={formData.selectedObjective}
                            data={selections.objectives}
                            onChange={handleObjectiveChange}
                        />
                    </div>
                    <div className="col-3">
                        <InputSelection
                            label="Outcome"
                            value={formData.selectedOutcome}
                            data={selections.outcomes}
                            onChange={handleOutcomeChange}
                        />
                    </div>
                    <div className="col-3">
                        <InputSelection
                            label="Output"
                            value={formData.selectedOutput}
                            data={selections.outputs}
                            onChange={handleOutputChange}
                        />
                    </div>
                    <div className="col-3">
                        <InputSelection
                            label="Indicator"
                            value={formData.selectedIndicator}
                            data={selections.indicators}
                            onChange={handleIndicatorChange}
                        />
                    </div>
                </div>

                <br />
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <h5>Institutions and Institutional Groups</h5>
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <InstitutionCheckboxes
                        institutions={institutions}
                        selectedInstitutions={formData.selectedInstitutions}
                        handleInstitutionChange={handleInstitutionChange}
                    />
                    <div className="col-3 others">
                        <label htmlFor="Others">Others:</label>
                        <input
                            id="othersField"
                            className="form-control mt-2"
                            placeholder="Please specify"
                            value={formData.otherInstitution}
                            onChange={(e) => handleOtherInstitutionChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <h5>Gender, Age, and Disability Disaggregated Data</h5>
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        {renderGenderAgeDisabilityTable()}
                    </div>
                </div>

                <br />
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <label htmlFor="detailedDescription" className="form-label">Detailed Description of the Activity:</label>
                        <textarea
                            id="detailedDescription"
                            className="form-control"
                            placeholder="Describe the purpose and goals of the activity."
                            value={formData.detailedDescription}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <label htmlFor="keyOutputs" className="form-label">Key Outputs and Results:</label>
                        <textarea
                            id="keyOutputs"
                            className="form-control"
                            placeholder="Please present the major outputs of the activity implementation, detailing the tangible results and milestones achieved."
                            value={formData.keyOutputs}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <label htmlFor="challenges" className="form-label">Challenges and Obstacles Encountered:</label>
                        <textarea
                            id="challenges"
                            className="form-control"
                            placeholder="Describe the challenges and obstacles encountered throughout the activity implementation."
                            value={formData.challenges}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <label htmlFor="lessons" className="form-label">Lessons Learned:</label>
                        <textarea
                            id="lessons"
                            className="form-control"
                            placeholder="Describe the lessons learned throughout the activity implementation."
                            value={formData.lessons}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <label htmlFor="successStories" className="form-label">Success Stories:</label>
                        <textarea
                            id="successStories"
                            className="form-control"
                            placeholder="Please highlight the impactful achievements and positive outcomes from the activity implementation."
                            value={formData.successStories}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <label htmlFor="conclusions" className="form-label">Conclusions and Recommendations:</label>
                        <textarea
                            id="conclusions"
                            className="form-control"
                            placeholder="Please outline the key findings and suggestions for future improvements and strategies."
                            value={formData.conclusions}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="button-container">
                        <button type="button" style={{marginRight: 10}} className="button-create" onClick={clearForm}>Clear</button>
                        <button type="submit" className="button-save isNotDisabled">Save</button> 
                    </div>
                </div>
            </form>

            {PDFData && (
                <div style={{ display: 'none' }}>
                    <ActivityReportPrint PDFData={PDFData} activityReportID={PDFActivityReportID} />
                </div>
            )}
        </div>
    );
}

export default ActivityReport;