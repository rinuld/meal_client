import React, { useState, useEffect, memo, useContext } from 'react';
import { shortenText } from '../utils/Utils';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import InputText from "../utils/InputText";
import { InsertLogData } from '../InsertLogData';
import { toast } from 'react-toastify';
import InputTextArea from '../utils/InputTextArea';
import InputSelection from '../utils/InputSelection';
import Axios from 'axios';
import AuthContext from '../../context/AuthProvider';

const IndicatorTable = memo(({ data, setData }) => {
  const { auth } = useContext(AuthContext);
  const [insertionTrigger, setInsertionTrigger] = useState(0);
  const [outcomeData, setOutcomeData] = useState([]);
  const [outputData, setOutputData] = useState([]);
  const [indicatorOutputData, setIndicatorOutputData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [selectedDeleteData, setSelectedDeleteData] = useState([]);
  const [actualsLastUpdates, setActualsLastUpdates] = useState([]);
  const [rowVisible, setRowVisible] = useState(null);

  // edit
  const [editObjective, seteditObjective] = useState("");
  const [editingIDObj, seteditingIDObj] = useState("");

  const [editOutcome, seteditOutcome] = useState("");
  const [editingIDOutcome, seteditingIDOutcome] = useState("");

  const [editOutput, seteditOutput] = useState("");
  const [editingIDOutput, seteditingIDOutput] = useState("");

  // modal inputs
  const [outcome, setOutcome] = useState("");
  const [output, setOutput] = useState("");

  // inidcator data inputs
  const [indicator, setIndicator] = useState("");
  const [iskpi, setIskpi] = useState(0);
  const [targetReach, setTargetReach] = useState("");
  const [unit, setunit] = useState({ value: 'Youth', label: 'Youth' });
  const [format, setFormat] = useState({ value: 'Quantitative', label: 'Quantitative' });
  const [freqreport, setFreqReport] = useState({ value: 'Yearly', label: 'Yearly' });

  useEffect(() => {
    const fetchOutcomes = async () => {
      try {
        const outcomeDataPromises = data.map(item =>
          fetch(`http://localhost:3001/api/outcomes/${item.goalID}`)
            .then(response => response.json())
        );
        const fetchedOutcomeData = await Promise.all(outcomeDataPromises);
        const mergedOutcomeData = fetchedOutcomeData.flat();
        setOutcomeData(mergedOutcomeData);
      } catch (error) {
        console.log('Error fetching outcome data:', error);
      }
    };
  
    if (data.length > 0) {
      fetchOutcomes();
    }
  }, [data, insertionTrigger]);
  
  useEffect(() => {
    const fetchOutputs = async () => {
      try {
        const outputDataPromises = outcomeData.map(outcome =>
          fetch(`http://localhost:3001/api/outputs/${outcome.outcomeID}`)
            .then(response => {
              console.log(response); // Log the response
              return response.json();
            })
        );
        const fetchedOutputData = await Promise.all(outputDataPromises);
        const mergedOutputData = fetchedOutputData.flat();
        setOutputData(mergedOutputData);
      } catch (error) {
        console.log('Error fetching output data:', error);
      }
    };
    
  
    if (outcomeData.length > 0) {
      fetchOutputs();
    }
  }, [outcomeData, insertionTrigger]);
  
  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const indicatorDataPromises = outputData.map(output =>
          fetch(`http://localhost:3001/api/indicators/${output.outputID}`)
            .then(response => response.json())
        );
        const fetchedIndicatorData = await Promise.all(indicatorDataPromises);
        const mergedIndicatorData = fetchedIndicatorData.flat();
        setIndicatorOutputData(mergedIndicatorData);
      } catch (error) {
        console.log('Error fetching indicator data:', error);
      }
    };
  
    if (outputData.length > 0) {
      fetchIndicators();
    }
  }, [outputData, insertionTrigger]);
  
  useEffect(() => {
    const fetchActualsLastUpdates = async () => {
      try {
        const actualsLastUpdatesPromises = indicatorOutputData.map(indicator =>
          fetch(`http://localhost:3001/api/indicatorData/${indicator.indicatorID}`)
            .then(response => response.json())
        );
        const fetchedActualsLastUpdates = await Promise.all(actualsLastUpdatesPromises);
        const mergedActualsLastUpdates = fetchedActualsLastUpdates.flat();
        setActualsLastUpdates(mergedActualsLastUpdates);
      } catch (error) {
        console.log('Error fetching actuals and last updates data:', error);
      }
    };
  
    if (indicatorOutputData.length > 0) {
      fetchActualsLastUpdates();
    }
  }, [indicatorOutputData, insertionTrigger]);

  const triggerInsertion = () => {
    setInsertionTrigger(prevTrigger => prevTrigger + 1);
  };

  const handleOpenModal = (rowData, framework) => {
    setSelectedRowData({ rowData, framework });
    setShowModal(true);
  };

  const handleDelete = (rowData, framework) => {
    console.log(rowData)
    setSelectedDeleteData({ rowData, framework });
    setShowDeleteModal(true);
  };

  const handleDeleteItem = (e, id, framework) => {
    e.preventDefault();

    console.log(id, framework);
    if (framework === "Objectives") {
      Axios.put(`http://localhost:3001/api/updateDeleteObjectives/${id}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          setData(prevData => prevData.filter(item => item.id !== id));
          setShowDeleteModal(false);
          InsertLogData("Deleted Objective " + response.title, auth.firstname);
          toast.success('Objective Deleted', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            hideProgressBar: true,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else if (framework === "Outcomes") {
      Axios.put(`http://localhost:3001/api/updateDeleteOutcomes/${id}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          setOutcomeData(prevData => prevData.filter(item => item.id !== id));
          setShowDeleteModal(false);
          InsertLogData("Deleted Outcome " + response.title, auth.firstname);
          toast.success('Outcome Deleted', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            hideProgressBar: true,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else if (framework === "Outputs")  {
      Axios.put(`http://localhost:3001/api/updateDeleteOutputs/${id}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          setOutputData(prevData => prevData.filter(item => item.id !== id));
          setShowDeleteModal(false);
          InsertLogData("Deleted Output " + response.title, auth.firstname);
          toast.success('Output Deleted', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            hideProgressBar: true,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else if (framework === "Indicators") {
      Axios.put(`http://localhost:3001/api/updateDeleteIndicator/${id}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          setIndicatorOutputData(prevData => prevData.filter(item => item.id !== id));
          setShowDeleteModal(false);
          InsertLogData("Deleted Outcome " + response.title, auth.firstname);
          toast.success('Outcome Deleted', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
            hideProgressBar: true,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setShowDeleteModal(false);
  };

  const handleSubmitOutcome = (e, goalID) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/createOutcome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ outcome, goalID }),
    })
      .then(response => response.json())
      .then(data => {
        setOutcome("");
        setShowModal(false);
        setOutcomeData([...outcomeData, data]);
        InsertLogData("Created Outcome " + data.title, auth.firstname);
        triggerInsertion();
        toast.success('Outcome Saved', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
        });
      })
      .catch(error => {
        console.log('Error inserting data:', error);
      });
  };

  const handleSubmitOutput = (e, outcomeID) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/createOutput', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ output, outcomeID }),
    })
      .then(response => response.json())
      .then(data => {
        setOutput("");
        setShowModal(false);
        setOutputData([...outputData, data]);
        InsertLogData("Created Output " + data.title, auth.firstname);
        triggerInsertion();
        toast.success('Output Saved', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
        });
      })
      .catch(error => {
        console.log('Error inserting data:', error);
      });
  };

  const handleSubmitIndicator = (e, outputID) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/createIndicators', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        indicator: indicator,
        iskpi: iskpi,
        targetReach: targetReach,
        actualReach: 0,
        unit: unit.value,
        format: format.value,
        freqreport: freqreport.value,
        outputID: outputID,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setTargetReach("");
        setIndicator("");
        setunit({ value: 'Youth', label: 'Youth' });
        setFormat({ value: 'Quantitative', label: 'Quantitative' });
        setFreqReport({ value: 'Yearly', label: 'Yearly' });
        setIskpi(0);
        setShowModal(false);
        setIndicatorOutputData(prevData => [...prevData, data]);
        InsertLogData("Created Indicator " + data.indicator, auth.firstname);
        triggerInsertion();
        toast.success('Indicator Saved', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
        });
      })
      .catch(error => {
        console.log('Error inserting data:', error);
      });
  };

  const unitDataSelection = [
    { value: 'Youth', label: 'Youth' },
    { value: 'Organization', label: 'Organization' },
    { value: 'Software', label: 'Software' },
    { value: 'Children', label: 'Children' },
    { value: 'Adults', label: 'Adults' },
    { value: 'infrastructure', label: 'infrastructure' },
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

  const handleTitleClick = (title, goalID) => {
    seteditObjective(title);
    seteditingIDObj(goalID);
  };

  const handleOutcomeTitleClick = (title, id) => {
    seteditOutcome(title);
    seteditingIDOutcome(id);
  };

  const handleOutputTitleClick = (title, id) => {
    seteditOutput(title);
    seteditingIDOutput(id);
  };

  const handleSaveTitle = (goalID) => {
    Axios.put(`http://localhost:3001/api/updateObjective/${goalID}`, { editObjective }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        InsertLogData("Updated Objective title " + editObjective, auth.firstname);
        setData((prevData) =>
          prevData.map((item) => {
            if (item.goalID === goalID) {
              return {
                ...item,
                title: editObjective,
              };
            }
            return item;
          })
        );
        seteditObjective("");
        seteditingIDObj("");
        console.log("Objective Saved!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSaveOutcomeTitle = (outcomeID) => {
    Axios.put(`http://localhost:3001/api/updateOutcome/${outcomeID}`, { editOutcome }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        InsertLogData("Updated Outcome title " + editOutcome, auth.firstname);
        setOutcomeData((prevData) =>
          prevData.map((item) => {
            if (item.outcomeID === outcomeID) {
              return {
                ...item,
                title: editOutcome,
              };
            }
            return item;
          })
        );
        seteditOutcome("");
        seteditingIDOutcome("");
        console.log("Outcome Saved!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSaveOutputTitle = (outputID) => {
    Axios.put(`http://localhost:3001/api/updateOutput/${outputID}`, { editOutput }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        InsertLogData("Updated Output title " + editOutput, auth.firstname);
        setOutcomeData((prevData) =>
          prevData.map((item) => {
            if (item.outputID === outputID) {
              return {
                ...item,
                title: editOutput,
              };
            }
            return item;
          })
        );
        seteditOutput("");
        seteditingIDOutput("");
        console.log("Output Saved!");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log('Render Indicator Table');
  return (
    <>
      <div className="card-table">
        <table>
          <thead>
            <tr>
              <th style={{ width: '40%' }}>Title</th>
              <th style={{ width: '10%' }}>Format</th>
              <th style={{ width: '20%' }}>Frequency of Reporting</th>
              <th style={{ width: '30%' }}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, objectiveIndex) => (
                <React.Fragment key={item.goalID}>
                  <tr className="objective-rows" onMouseEnter={() => setRowVisible(item.goalID)} onMouseLeave={() => setRowVisible(null)}>
                    <td colSpan={3}>
                      {editingIDObj === item.goalID ? (
                        <div className="input-text">
                          <input
                            type="text"
                            value={editObjective}
                            onChange={(e) => seteditObjective(e.target.value)}
                            onBlur={() => handleSaveTitle(item.goalID)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <p onClick={() => handleTitleClick(item.title, item.goalID)}>
                          {`${objectiveIndex + 1}. ${item.title}`}
                        </p>
                      )}
                    </td>
                    <td colSpan={1}>
                      {rowVisible === item.goalID &&
                        <div className="table-button">
                          <button
                            className="modal-add-button primary"
                            type="button"
                            data-toggle="modal"
                            data-target={`#indicator${item.goalID}`}
                            aria-expanded="false"
                            aria-haspopup="true"
                            onClick={() => handleOpenModal(item, "Objectives")}
                          >
                            <i className="fa fa-plus btn-add"></i>
                          </button>
                          <button
                            className="modal-add-button primary"
                            type="button"
                            onClick={() => handleDelete(item, "Objectives")}
                          >
                            <i className="fa fa-trash btn-add"></i>
                          </button>
                        </div>
                      }
                    </td>
                  </tr>
                  {outcomeData
                    .filter((outcome) => outcome.goalID === item.goalID)
                    .map((outcome, outcomeIndex) => (
                      <React.Fragment key={outcome.outcomeID}>
                        <tr className="outcome-rows" key={outcome.outcomeID} onMouseEnter={() => setRowVisible(outcome.outcomeID)} onMouseLeave={() => setRowVisible(null)}>
                          <td colSpan={3}>
                            {editingIDOutcome === outcome.outcomeID ? (
                              <div className="input-text">
                                <input
                                  type="text"
                                  value={editOutcome}
                                  onChange={(e) => seteditOutcome(e.target.value)}
                                  onBlur={() => handleSaveOutcomeTitle(outcome.outcomeID)}
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <p style={{ textIndent: '15px' }} onClick={() => handleOutcomeTitleClick(outcome.title, outcome.outcomeID)}>
                                {`${objectiveIndex + 1}.${outcomeIndex + 1}. ${shortenText(outcome.title)}`}
                              </p>
                            )}
                          </td>
                          <td colSpan={1}>
                            {rowVisible === outcome.outcomeID &&
                              <div className="table-button">
                                <button
                                  className="modal-add-button secondary"
                                  type="button"
                                  data-toggle="modal"
                                  data-target={`#indicator${outcome.outcomeID}`}
                                  aria-expanded="false"
                                  aria-haspopup="true"
                                  onClick={() => handleOpenModal(outcome, "Outcomes")}
                                >
                                  <i className="fa fa-plus btn-add"></i>
                                </button>
                                <button
                                  className="modal-add-button secondary"
                                  type="button"
                                  data-target={`#indicator${outcome.outcomeID}`}
                                  onClick={() => handleDelete(outcome, "Outcomes")}
                                >
                                  <i className="fa fa-trash btn-add"></i>
                                </button>
                              </div>
                            }
                          </td>
                        </tr>
                        {outputData
                          .filter((output) => output.objOutID === outcome.outcomeID)
                          .map((output, outputIndex) => (
                            <React.Fragment key={output.outputID}>
                              <tr className="output-rows" key={output.outputID} onMouseEnter={() => setRowVisible(output.outputID)} onMouseLeave={() => setRowVisible(null)}>
                                <td colSpan={3}>
                                  {editingIDOutput === output.outputID ? (
                                    <div className="input-text">
                                      <input
                                        type="text"
                                        value={editOutput}
                                        onChange={(e) => seteditOutput(e.target.value)}
                                        onBlur={() => handleSaveOutputTitle(output.outputID)}
                                        autoFocus
                                      />
                                    </div>
                                  ) : (
                                    <p style={{ textIndent: '45px' }} onClick={() => handleOutputTitleClick(output.title, output.outputID)}>
                                      <span>{`${objectiveIndex + 1}.${outcomeIndex + 1}.${outputIndex + 1} ${shortenText(output.title)}`}</span>
                                    </p>
                                  )}
                                </td>
                                <td colSpan={1}>
                                  {rowVisible === output.outputID && (
                                    <div className="table-button">
                                      <button
                                        className="modal-add-button secondary"
                                        type="button"
                                        data-toggle="modal"
                                        data-target={`#indicator${output.outputID}`}
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                        onClick={() => handleOpenModal(output, "Outputs")}
                                      >
                                        <i className="fa fa-plus btn-add"></i>
                                      </button>
                                      <button
                                        className="modal-add-button secondary"
                                        type="button"
                                        data-target={`#indicator${output.outputID}`}
                                        onClick={() => handleDelete(output, "Outputs")}
                                      >
                                        <i className="fa fa-trash btn-add"></i>
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                              {indicatorOutputData
                                .filter((indicator) => indicator.objOutID === output.outputID)
                                .map((indicator, indicatorIndex) => (
                                  <tr className="indicator-rows" key={indicator.indicatorID} onMouseEnter={() => setRowVisible(indicator.indicatorID)} onMouseLeave={() => setRowVisible(null)}>
                                    <td className="first-col">
                                      <Link to={`/indicatordetails/${indicator.indicatorID}`} className="link-text">
                                        <div className="cell-content indicator-data">
                                          <span className="activity-code-txt" style={{ marginLeft: '75px' }}>{`${objectiveIndex + 1}.${outcomeIndex + 1}.${outputIndex + 1}.${indicatorIndex + 1} ${shortenText(indicator.indicator)}`}</span>
                                        </div>
                                      </Link>
                                    </td>
                                    <td className="indicator-data">{indicator.format}</td>
                                    <td className="indicator-data">{indicator.freqreport}</td>
                                    <td className="indicator-data no-padding">
                                      <div className="progress-with-button">
                                        <div className="progress-indicator">
                                          <p>
                                            Actuals VS Target: {indicator.actualreach} / {indicator.targetreach}
                                          </p>
                                          <progress value={(indicator.actualreach / indicator.targetreach) * 100} max="100" />
                                        </div>
                                        <div className="delete-button-container">
                                          {rowVisible === indicator.indicatorID && (
                                            <button
                                              className="modal-add-button secondary"
                                              type="button"
                                              onClick={() => handleDelete(indicator, "Indicators")}
                                              style={{ marginLeft: '1rem' }}
                                            >
                                              <i className="fa fa-trash btn-add"></i>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </React.Fragment>
                          ))}
                      </React.Fragment>
                    ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="12">
                  <div className='empty-table-data'>
                    <p>No Data Available</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal className='d-flex align-items-center justify-content-center' show={showModal} onHide={handleCloseModal}>
          { selectedRowData.framework === "Objectives" &&
            <>
              <Modal.Header closeButton>
                <Modal.Title>Create Outcomes</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='modal-form'>
                  <form onSubmit={(e) => handleSubmitOutcome(e, (selectedRowData.rowData).goalID)}>
                    <div className='row'>
                      <div className='col-12'>
                        <InputText
                          label="Outcome"
                          id="outcome"
                          type="text"
                          placeholder="enter outcome"
                          name="outcome"
                          value={outcome}
                          onChange={(e) => setOutcome(e.target.value)}
                        />
                      </div>
                      <div className="button-container">
                        <button type="submit" className="button-save">Save</button>
                      </div>
                    </div>
                  </form>
                </div>
              </Modal.Body>
            </>
          }
          
          { selectedRowData.framework === "Outcomes" &&
              <>
                <Modal.Header closeButton>
                  <Modal.Title>Create Outputs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='modal-form'>
                    <form onSubmit={(e) => handleSubmitOutput(e, (selectedRowData.rowData).outcomeID)}>
                      <div className='row'>
                        <div className='col-12'>
                          <InputText
                            label="Output"
                            id="output"
                            type="text"
                            placeholder="enter output"
                            name="output"
                            value={output}
                            onChange={(e) => setOutput(e.target.value)}
                          />
                        </div>
                        <div className="button-container">
                          <button type="submit" className="button-save">Save</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Modal.Body>
              </>
          }

          { selectedRowData.framework === "Outputs" &&
              <>
                <Modal.Header closeButton>
                  <Modal.Title>Create Indicators</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className='modal-form row'>
                    <form onSubmit={(e) => handleSubmitIndicator(e, (selectedRowData.rowData).outputID)}>
                      <div className='row'>
                        <div className='col-12'>
                          <InputTextArea
                            label="Indicator"
                            id="indicator"
                            placeholder="enter indicator"
                            name="indicator"
                            value={indicator}
                            onChange={(e) => setIndicator(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className='row'>
                        <label>
                          <input
                            type="checkbox"
                            checked={iskpi}
                            onChange={(e) => setIskpi(e.target.checked)}
                          />Is KPI (Key Performance Indicator)
                        </label>
                      </div>
                      <div className='row'>
                        <div className='col-6'>
                          <InputText
                            label="Target"
                            id="target"
                            type="number"
                            placeholder="enter target"
                            name="target"
                            value={targetReach}
                            onChange={(e) => setTargetReach(e.target.value)}
                          />
                        </div>
                        <div className='col-6'>
                          <InputSelection
                            label="Unit"
                            value={unit}
                            data={unitDataSelection}
                            onChange={(e) => setunit(e)}
                          />
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-6'>
                          <InputSelection
                            label="Format"
                            value={format}
                            data={formatDataSelection}
                            onChange={(e) => setFormat(e)}
                          />
                        </div>
                        <div className='col-6'>
                          <InputSelection
                            label="Reporting"
                            value={freqreport}
                            data={reportingDataSelection}
                            onChange={(e) => setFreqReport(e)}
                          />
                        </div>
                      </div>
                      <div className="button-container">
                        <button type="submit" className="button-save">Save</button>
                      </div>
                    </form>
                  </div>
                </Modal.Body>
              </>
          }
        </Modal>
      )}
      {showDeleteModal && (
        <Modal className='d-flex align-items-center justify-content-center' show={showDeleteModal} onHide={handleCloseModal}>
        {selectedDeleteData.framework === "Objectives" &&
          <>
            <Modal.Header closeButton>
              <Modal.Title>Please Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='modal-form'>
                <form onSubmit={(e) => handleDeleteItem(e, (selectedDeleteData.rowData).id, selectedDeleteData.framework)}>
                  <div className='row'>
                    <div className='delete-modal'>
                      <p className='header-modal-title'>Are you sure you want to delete this Objective?</p>
                      <p className='content-modal'>{selectedDeleteData.rowData.title}</p>
                    </div>
                    <div className="button-container text-center">
                      <button type="submit" className="button-delete put-center">Delete</button>
                    </div>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </>
        }
        
        {selectedDeleteData.framework === "Outcomes" &&
          <>
            <Modal.Header closeButton>
              <Modal.Title>Please Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='modal-form'>
                <form onSubmit={(e) => handleDeleteItem(e, (selectedDeleteData.rowData).id, selectedDeleteData.framework)}>
                  <div className='row'>
                    <div className='delete-modal'>
                      <p className='header-modal-title'>Are you sure you want to delete this Outcome?</p>
                      <p className='content-modal'>{selectedDeleteData.rowData.title}</p>
                    </div>
                    <div className="button-container text-center">
                      <button type="submit" className="button-delete put-center">Delete</button>
                    </div>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </>
        }
        
        {selectedDeleteData.framework === "Outputs" &&
          <>
            <Modal.Header closeButton>
              <Modal.Title>Please Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='modal-form'>
                <form onSubmit={(e) => handleDeleteItem(e, (selectedDeleteData.rowData).id, selectedDeleteData.framework)}>
                  <div className='row'>
                    <div className='delete-modal'>
                      <p className='header-modal-title'>Are you sure you want to delete this Output?</p>
                      <p className='content-modal'>{selectedDeleteData.rowData.title}</p>
                    </div>
                    <div className="button-container text-center">
                      <button type="submit" className="button-delete put-center">Delete</button>
                    </div>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </>
        }
        
        {selectedDeleteData.framework === "Indicators" &&
          <>
            <Modal.Header closeButton>
              <Modal.Title>Please Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='modal-form'>
                <form onSubmit={(e) => handleDeleteItem(e, (selectedDeleteData.rowData).id, selectedDeleteData.framework)}>
                  <div className='row'>
                    <div className='delete-modal'>
                      <p className='header-modal-title'>Are you sure you want to delete this Indicator?</p>
                      <p className='content-modal'>{selectedDeleteData.rowData.indicator}</p>
                    </div>
                    <div className="button-container text-center">
                      <button type="submit" className="button-delete put-center">Delete</button>
                    </div>
                  </div>
                </form>
              </div>
            </Modal.Body>
          </>
        }
        </Modal>      
      )}
    </>
  );
});

export default IndicatorTable;
