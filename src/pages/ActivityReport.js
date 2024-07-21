import { useState, useEffect } from "react";
import Axios from 'axios';
import { toast } from 'react-toastify';
import InputSelection from "../components/utils/InputSelection";

function ActivityReport() {
    const [projects, setProjects] = useState([]);
    const [activities, setActivities] = useState([]);
    const [objectives, setObjectives] = useState([]);
    const [outcomes, setOutcomes] = useState([]);
    const [outputs, setOutputs] = useState([]);
    const [indicators, setIndicators] = useState([]);
    const [gaddData, setGaddData] = useState(false);

    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedObjective, setSelectedObjective] = useState(null);
    const [selectedOutcome, setSelectedOutcome] = useState(null);
    const [selectedOutput, setSelectedOutput] = useState(null);
    const [selectedIndicator, setSelectedIndicator] = useState(null);

    useEffect(() => {
        Axios.get('http://localhost:3001/api/projects')
            .then(response => {
                console.log('Fetched projects:', response.data);
                
                const formattedProjects = response.data.map(project => ({
                    value: project.projectID,
                    label: project.projectName
                }));

                console.log('Formatted projects:', formattedProjects);
                setProjects(formattedProjects);
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                toast.error('Error fetching projects');
            });
    }, []);

    const handleProjectChange = (selectedOption) => {
        setSelectedProject(selectedOption);
        setSelectedActivity(null);
        setSelectedObjective(null);
        setSelectedOutcome(null);
        setSelectedOutput(null);
        setSelectedIndicator(null);
        console.log('Selected project:', selectedOption.label);

        Axios.get(`http://localhost:3001/api/activities/${selectedOption.value}`)
            .then(response => {
                console.log('Fetched activities:', response.data);
                
                const formattedActivities = response.data.map(activity => ({
                    value: activity.activityID,
                    label: activity.activityName
                }));

                console.log('Formatted activities:', formattedActivities);
                setActivities(formattedActivities);
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
                toast.error('Error fetching activities');
            });

        Axios.get(`http://localhost:3001/api/objectives/${selectedOption.value}`)
            .then(response => {
                console.log('Fetched objectives:', response.data);
                
                const formattedObjectives = response.data.map(objective => ({
                    value: objective.goalID,
                    label: objective.title
                }));

                console.log('Formatted objectives:', formattedObjectives);
                setObjectives(formattedObjectives);
            })
            .catch(error => {
                console.error('Error fetching objectives:', error);
                toast.error('Error fetching objectives');
            });
    };

    const handleActivityChange = (selectedOption) => {
        setSelectedActivity(selectedOption);
        setSelectedObjective(null);
        setSelectedOutcome(null);
        setSelectedOutput(null);
        setSelectedIndicator(null);
        console.log('Selected activity:', selectedOption.label);
    };

    const handleObjectiveChange = (selectedOption) => {
        setSelectedObjective(selectedOption);
        setSelectedOutcome(null);
        setSelectedOutput(null);
        setSelectedIndicator(null);
        console.log('Selected objective:', selectedOption.label);

        Axios.get(`http://localhost:3001/api/outcomes/${selectedOption.value}`)
        .then(response => {
            console.log('Fetched outcomes:', response.data);
            
            const formattedOutcomes = response.data.map(outcome => ({
                value: outcome.outcomeID,
                label: outcome.title
            }));

            console.log('Formatted outcomes:', formattedOutcomes);
            setOutcomes(formattedOutcomes);
        })
        .catch(error => {
            console.error('Error fetching outcomes:', error);
            toast.error('Error fetching outcomes');
        });
    };

    const handleOutcomeChange = (selectedOption) => {
        setSelectedOutcome(selectedOption);
        setSelectedOutput(null);
        setSelectedIndicator(null);
        console.log('Selected outcome:', selectedOption.label);

        Axios.get(`http://localhost:3001/api/outputs/${selectedOption.value}`)
            .then(response => {
                console.log('Fetched outputs:', response.data);
                
                const formattedOutputs = response.data.map(output => ({
                    value: output.outputID,
                    label: output.title
                }));

                console.log('Formatted outputs:', formattedOutputs);
                setOutputs(formattedOutputs);
            })
            .catch(error => {
                console.error('Error fetching outputs:', error);
                toast.error('Error fetching outputs');
            });
    };

    const handleOutputChange = (selectedOption) => {
        setSelectedOutput(selectedOption);
        setSelectedIndicator(null);
        console.log('Selected output:', selectedOption.label);

        Axios.get(`http://localhost:3001/api/indicators/${selectedOption.value}`)
            .then(response => {
                console.log('Fetched indicators:', response.data);
                
                const formattedIndicators = response.data.map(indicator => ({
                    value: indicator.indicatorID,
                    label: indicator.indicator
                }));

                console.log('Formatted indicators:', formattedIndicators);
                setIndicators(formattedIndicators);
            })
            .catch(error => {
                console.error('Error fetching indicators:', error);
                toast.error('Error fetching indicators');
            });
    };

    const handleIndicatorChange = (selectedOption) => {
        setSelectedIndicator(selectedOption);
        console.log('Selected indicator:', selectedOption.label);
    };

    const handleGaddDataChange = () => {
        setGaddData(!gaddData);
        console.log('Selected Gender, Age, and Disability Disaggregated Data:', gaddData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="create-forms">
            <form onSubmit={handleSubmit}>
                <div className="row gx-3">
                    <div className="col-3">
                        <InputSelection
                            label="Project"
                            value={selectedProject}
                            data={projects}
                            onChange={handleProjectChange}
                        />
                    </div>
                    <div className="col-3">
                        <InputSelection
                            label="Activity"
                            value={selectedActivity}
                            data={activities}
                            onChange={handleActivityChange}
                        />
                    </div>
                </div>
                <div className="row gx-3">
                    <div className="col-3">
                        <InputSelection
                            label="Objective"
                            value={selectedObjective}
                            data={objectives}
                            onChange={handleObjectiveChange}
                        />
                    </div>
                    <div className="col-3">
                        <InputSelection
                            label="Outcome"
                            value={selectedOutcome}
                            data={outcomes}
                            onChange={handleOutcomeChange}
                        />
                    </div>
                    <div className="col-3">
                        <InputSelection
                            label="Output"
                            value={selectedOutput}
                            data={outputs}
                            onChange={handleOutputChange}
                        />
                    </div>
                    <div className="col-3">
                        <InputSelection
                            label="Indicator"
                            value={selectedIndicator}
                            data={indicators}
                            onChange={handleIndicatorChange}
                        />
                    </div>
                </div>
                <div className="row gx-3">
                    <div className="gaddData">
                        <label htmlFor="gaddData" className="gaddData"><p>Gender, Age, and Disability Disaggregated Data</p></label>
                        <input
                            type="checkbox"
                            id="gaddData"
                            checked={gaddData}
                            onChange={handleGaddDataChange}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ActivityReport;
