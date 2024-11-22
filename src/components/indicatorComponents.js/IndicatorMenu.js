import { useContext, useEffect, useState } from "react";
import InputText from "../utils/InputText";
import BarGraph from "../utils/BarChart";
import ImportData from "../utils/ImportData";
import axios from "axios";
import CreateForm from "../CreateForm";
import InputSelection from "../utils/InputSelection";
import { InsertLogData } from "../InsertLogData";
import { toast } from "react-toastify";
import HistoryTableIndicator from "./HistoryTableIndicators";
import { Modal } from 'react-bootstrap';
import ButtonIcon from "../utils/ButtonIcon";
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import AuthContext from "../../context/AuthProvider";

function IndicatorMenu({ indicatorDetails, indicatorData }) {
    const { auth } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('details');
    const [participantsdata, setParticipantsData] = useState([]);
    const [indicatorName, setIndicatorName] = useState('');
    const [unit, setUnit] = useState('');
    const [format, setFormat] = useState({});
    const [freqReport, setFreqReport] = useState({});
    const [targetReach, setTarget] = useState(0);
    const [actualReach, setActual] = useState(0);
    const [reset, setReset] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // participants data inputs
    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [middlename, setmiddlename] = useState('');
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState({ value: 'Male', label: 'Male' });
    const [address, setAddress] = useState({ value: 'Bacolod City', label: 'Bacolod City' });
    const [org, setOrg] = useState('');

    useEffect(() => {
        // fetchParticipantsData();
        axios.get(`http://localhost:3001/api/indicatordetails/${indicatorDetails.indicatorID}`)
            .then(response => {
                const actualreach = response.data[0].actualreach; // Assuming the actualreach is stored in the 'actualreach' field of the response data
                setActual(actualreach);
            })
            .catch(error => {
                console.log('Error fetching actual reach:', error);
            });
        // fetchActualReach();
    }, [indicatorDetails.indicatorID, reset]);

    useEffect(() => {
        setIndicatorName(indicatorDetails.indicator || '');
        setUnit(indicatorDetails.unit || '' );
        setFormat({ value: indicatorDetails.format, label: indicatorDetails.format });
        setFreqReport({ value: indicatorDetails.freqreport, label: indicatorDetails.freqreport });
        setTarget(indicatorDetails.targetreach || 0);
    }, [indicatorDetails.indicator, indicatorDetails.unit, indicatorDetails.format, indicatorDetails.freqreport, indicatorDetails.targetreach, indicatorDetails.actualreach])

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const refreshdata = () => {
        setReset(!reset);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/api/updateIndicator/${indicatorDetails.indicatorID}`, { indicatorName, targetReach, actualReach, unit, format: format.value, freqReport: freqReport.value }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                InsertLogData("Updated Indicator Details", auth.firstname);
                toast.success('Indicator Updated', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    hideProgressBar: true,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const inserparticipantsdata = {
        firstname,
        lastname,
        middlename,
        age,
        sex: sex.value,
        org,
        cityMun: address.value,
        indicatorID: indicatorDetails.indicatorID
    };

    const handlesubmitparticipants = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/createparticipants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inserparticipantsdata),
        })
            .then(response => response.json())
            .then(data2 => {
                const newData = {
                    id: data2.id,
                    firstname: data2.firstname,
                    lastname: data2.lastname,
                    middlename: data2.middlename,
                    age: data2.age,
                    sex: data2.sex,
                    cityMun: data2.cityMun,
                    organization: data2.organization,
                    indicatorID: data2.indicatorID
                };
                setParticipantsData([...participantsdata, newData]);
                InsertLogData("Added participants " + firstname + lastname, auth.firstname);
                toast.success('Participants Saved', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                    hideProgressBar: true,
                });
                setReset(!reset);
                setfirstname('');
                setlastname('');
                setmiddlename('');
                setAge(0);
                setSex({ value: 'Male', label: 'Male' });
                setAddress({ value: 'Bacolod City', label: 'Bacolod City' });
                setOrg('');
            })
            .catch(error => {
                console.log('Error inserting data:', error);
            })
    }

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const graphData = indicatorData
        ? {
            years: ["Current"],
            targetReach: [indicatorDetails.targetreach],
            actualReach: [actualReach],
        }
        : {
            years: [...indicatorData.map(item => item.year), "Current"],
            targetReach: [...indicatorData.map(item => item.targetReach), indicatorDetails.targetreach],
            actualReach: [...indicatorData.map(item => item.actualReach), actualReach],
        };

    const historyTabledata = indicatorData
        ? [
            {
                year: "Current",
                targetReach: indicatorDetails.targetreach,
                actualReach: actualReach,
            }
        ]
        : [
            ...indicatorData,
            {
                year: "Current",
                targetReach: indicatorDetails.targetreach,
                actualReach: actualReach,
            }
        ];

    const selectsex = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ];

    const selectAddress = [
        { value: 'Bacolod City', label: 'Bacolod City' },
        { value: 'Bago City', label: 'Bago City' },
        { value: 'Cadiz City', label: 'Cadiz City' },
        { value: 'Escalante City', label: 'Escalante City' },
        { value: 'Himamaylan City', label: 'Himamaylan City' },
        { value: 'Kabankalan City', label: 'Kabankalan City' },
        { value: 'La Carlota City', label: 'La Carlota City' },
        { value: 'Sagay City', label: 'Sagay City' },
        { value: 'San Carlos City', label: 'San Carlos City' },
        { value: 'Silay City', label: 'Silay City' },
        { value: 'Sipalay City', label: 'Sipalay City' },
        { value: 'Talisay City', label: 'Talisay City' },
        { value: 'Victorias City', label: 'Victorias City' },
        { value: 'Binalbagan', label: 'Binalbagan' },
        { value: 'Calatrava', label: 'Calatrava' },
        { value: 'Candoni', label: 'Candoni' },
        { value: 'Cauayan', label: 'Cauayan' },
        { value: 'Enrique B. Magalona', label: 'Enrique B. Magalona' },
        { value: 'Hinigaran', label: 'Hinigaran' },
        { value: 'Hinoba-an', label: 'Hinoba-an' },
        { value: 'Ilog', label: 'Ilog' },
        { value: 'Isabela', label: 'Isabela' },
        { value: 'La Castellana', label: 'La Castellana' },
        { value: 'Manapla', label: 'Manapla' },
        { value: 'Moises Padilla', label: 'Moises Padilla' },
        { value: 'Murcia', label: 'Murcia' },
        { value: 'Pontevedra', label: 'Pontevedra' },
        { value: 'Pulupandan', label: 'Pulupandan' },
        { value: 'Salvador Benedicto', label: 'Salvador Benedicto' },
        { value: 'San Enrique', label: 'San Enrique' },
        { value: 'Toboso', label: 'Toboso' },
        { value: 'Valladolid', label: 'Valladolid' },
    ];

    const formatDataSelection = [
        { value: 'Quantitative', label: 'Quantitative' },
        { value: 'Qualitative', label: 'Qualitative' },
    ];

    const reportingDataSelection = [
        { value: 'Yearly', label: 'Yearly' },
        { value: 'Quarterly', label: 'Quarterly' },
        { value: 'Monthly', label: 'Monthly' },
    ];

    return (
        <>
            <div className="card-menu my-0">
                <ul>
                    <li className={`tab-header ${activeTab === 'details' ? 'active-menu' : ''}`} onClick={() => handleTabClick('details')}>
                        <div className="menu-item">
                            <i className="fas fa-clipboard-check"></i>&nbsp;
                            <span>Indicator Details</span>
                        </div>
                    </li>
                    <li className={`tab-header ${activeTab === 'report' ? 'active-menu' : ''}`} onClick={() => handleTabClick('report')}>
                        <div className="menu-item">
                            <i className="fa fa-bar-chart" aria-hidden="true"></i>&nbsp;
                            <span>Summary Report</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="contents">
                <div
                    className={`${activeTab === 'details' ? 'display-content' : 'tab-content '}`}
                >
                    <div className="create-forms">
                        <form onSubmit={handleSubmit}>
                            <div className="row gx-3">
                                <div className="col-12 col-md-6">
                                    <InputText
                                        label="Indicator"
                                        id="indicator"
                                        type="text"
                                        placeholder="Enter indicator"
                                        name="indicator"
                                        value={indicatorName}
                                        onChange={(e) => setIndicatorName(e.target.value)}
                                    />
                                </div><div className="col-12 col-md-6">
                                    <InputText
                                        label="Unit"
                                        id="unit"
                                        type="text"
                                        placeholder="Enter unit"
                                        name="unit"
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="row gx-3">
                                <div className="col-12 col-md-4">
                                    <InputSelection
                                        label="Format"
                                        value={format}
                                        data={formatDataSelection}
                                        onChange={(e) => setFormat(e)}
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <InputSelection
                                        label="Frequency of Reporting"
                                        value={freqReport}
                                        data={reportingDataSelection}
                                        onChange={(e) => setFreqReport(e)}
                                    />
                                </div>
                                <div className="col-12 col-md-2">
                                    <InputText
                                        label="Target"
                                        id="target"
                                        type="text"
                                        placeholder="Enter target"
                                        name="target"
                                        value={targetReach}
                                        onChange={(e) => setTarget(e.target.value)} />
                                </div>
                                <div className="col-12 col-md-2">
                                    <InputText
                                        label="Actuals"
                                        id="actuals"
                                        type="text"
                                        placeholder="Enter actuals"
                                        name="actuals"
                                        value={actualReach}
                                        onChange={(e) => setActual(e.target.value)}
                                         />
                                </div>
                            </div>
                            <div className="button-container">
                                <button type="submit" className="button-save">Save</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div
                    className={`${activeTab === 'report' ? 'display-content' : 'tab-content '}`}
                >
                    <div className="row">
                        <div className="col-6">
                            <div className="card-custom">
                                <HistoryTableIndicator data={historyTabledata} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card-custom">
                                <BarGraph data={graphData} />
                            </div>
                        </div>
                    </div>
                </div>

                {activeTab === 'data' && (
                    <>
                        <div className="display-content">
                            <CreateForm header="Add participants">
                                <form onSubmit={handlesubmitparticipants}>
                                    <div className="row gx-3">
                                        <div className="col-12 col-md-3">
                                            <InputText
                                                label="Participants First Name"
                                                id="name"
                                                type="text"
                                                placeholder="Enter first name"
                                                name="name"
                                                value={firstname}
                                                onChange={(e) => setfirstname(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <InputText
                                                label="Participants Last Name"
                                                id="name"
                                                type="text"
                                                placeholder="Enter last name"
                                                name="name"
                                                value={lastname}
                                                onChange={(e) => setlastname(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <InputText
                                                label="Participants Middle Name"
                                                id="name"
                                                type="text"
                                                placeholder="Enter middle name"
                                                name="name"
                                                value={middlename}
                                                onChange={(e) => setmiddlename(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <InputText
                                                label="Age"
                                                id="age"
                                                type="number"
                                                placeholder="Enter age"
                                                name="age"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row gx-3">
                                        <div className="col-12 col-md-8">
                                            <InputText
                                                label="Organization"
                                                id="org"
                                                type="text"
                                                placeholder="Enter organization"
                                                name="org"
                                                value={org}
                                                onChange={(e) => setOrg(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12 col-md-4">
                                            <InputSelection
                                                label="Sex"
                                                value={sex}
                                                data={selectsex}
                                                onChange={(e) => setSex(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="row gx-3">
                                        <div className="col-12 col-md-12">
                                            <InputSelection
                                                label="Address"
                                                value={address}
                                                data={selectAddress}
                                                onChange={(e) => setAddress(e)}
                                            />
                                        </div>
                                    </div>
                                    <div className="button-container">
                                        <button type="submit" className="button-save isNotDisabled" disabled={false}>Save</button>
                                    </div>
                                </form>
                            </CreateForm>
                            <ButtonIcon label="Import Data" onClick={() => handleOpenModal()} icon={faFileImport} type="secondary" />
                        </div>
                    </>
                )}
            </div>
            {showModal && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Import Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='modal-form'>
                            <ImportData indicatorDetails={indicatorDetails} onChange={refreshdata} />
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    )
}

export default IndicatorMenu;