import { useState, useEffect } from "react";
import Axios from 'axios';
import { toast } from 'react-toastify';
import InputSelection from "../components/utils/InputSelection";
import '../assets/css/ActivityReport.css';

function ActivityReport() {
    const initialState = {
        selectedProject: null,
        selectedActivity: null,
        selectedObjective: null,
        selectedOutcome: null,
        selectedOutput: null,
        selectedIndicator: null,
        selectedInstitutions: [],
        otherInstitution: "",
        detailedDescription: "",
        keyOutputs: "",
        challenges: "",
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

    const [formData, setFormData] = useState(initialState);

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
                const formattedActivities = formatData(response.data, 'activityID', 'activityName');
                setSelections(prev => ({ ...prev, activities: formattedActivities }));
            })
            .catch(error => handleApiError(error, 'Error fetching activities'));

        Axios.get(`http://localhost:3001/api/objectives/${selectedOption.value}`)
            .then(response => {
                const formattedObjectives = formatData(response.data, 'goalID', 'title');
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
                const formattedOutcomes = formatData(response.data, 'outcomeID', 'title');
                setSelections(prev => ({ ...prev, outcomes: formattedOutcomes }));
            })
            .catch(error => handleApiError(error, 'Error fetching outcomes'));
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
                const formattedOutputs = formatData(response.data, 'outputID', 'title');
                setSelections(prev => ({ ...prev, outputs: formattedOutputs }));
            })
            .catch(error => handleApiError(error, 'Error fetching outputs'));
    };

    const handleOutputChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            selectedOutput: selectedOption,
            selectedIndicator: null
        }));

        Axios.get(`http://localhost:3001/api/indicators/${selectedOption.value}`)
            .then(response => {
                const formattedIndicators = formatData(response.data, 'indicatorID', 'indicator');
                setSelections(prev => ({ ...prev, indicators: formattedIndicators }));
            })
            .catch(error => handleApiError(error, 'Error fetching indicators'));
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
            preparedData.detailedDescription,
            preparedData.keyOutputs,
            preparedData.challenges,
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
    
        // Prepare the data to be sent in the POST request
        const dataToPost = {
            selectedProject: formData.selectedProject,
            selectedActivity: formData.selectedActivity,
            selectedObjective: formData.selectedObjective,
            selectedOutcome: formData.selectedOutcome,
            selectedOutput: formData.selectedOutput,
            selectedIndicator: formData.selectedIndicator,
            selectedInstitutions: updatedInstitutions,
            genderAgeDisabilityData: preparedData.genderAgeDisabilityData,
            detailedDescription: preparedData.detailedDescription,
            keyOutputs: preparedData.keyOutputs,
            challenges: preparedData.challenges,
            successStories: preparedData.successStories,
            conclusions: preparedData.conclusions
        };

        console.log(dataToPost);
    
        // // Post the data to the server
        // Axios.post('http://localhost:3001/api/activity-report', dataToPost)
        //     .then(response => {
        //         toast.success("Activity report submitted successfully!");
        //         clearForm(); // Clear the form after successful submission
        //     })
        //     .catch(error => handleApiError(error, 'Error submitting activity report'));
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
            <form onSubmit={handleSubmit}>
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
                        <label htmlFor="detailedDescription" className="form-label">Detailed Description of Key Activities Conducted:</label>
                        <textarea
                            id="detailedDescription"
                            className="form-control"
                            value={formData.detailedDescription}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <label htmlFor="keyOutputs" className="form-label">Key Outputs:</label>
                        <textarea
                            id="keyOutputs"
                            className="form-control"
                            value={formData.keyOutputs}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <label htmlFor="challenges" className="form-label">Challenges:</label>
                        <textarea
                            id="challenges"
                            className="form-control"
                            value={formData.challenges}
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
                            value={formData.successStories}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="row gx-3 mb-3">
                    <div className="col-12">
                        <label htmlFor="conclusions" className="form-label">Conclusions:</label>
                        <textarea
                            id="conclusions"
                            className="form-control"
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
        </div>
    );
}

export default ActivityReport;
