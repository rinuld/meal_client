import { useContext, useEffect, useState } from "react";
import DatePickerInput from "../DatepickerInput";
import InputText from "../utils/InputText";
import InputTextArea from "../utils/InputTextArea";
import logo from '../../assets/images/logo.png';
import EntryTable from "../utils/EntryTable";
import ApprovalComponent from "../utils/ApprovalComponent";
import AuthContext from '../../context/AuthProvider';
import ReceivedComponent from "../utils/ReceivedComponent";
import { toast } from "react-toastify";
import { InsertLogData } from "../InsertLogData";
import { Page, Text, View, Document } from '@react-pdf/renderer';

const MyDocument = () => (
    <Document>
      <Page size="A4">
        <View>
          <Text>Section #1</Text>
        </View>
        <View>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );


function CreateVoucherForm() {
    const currentDate = new Date();
    const { auth } = useContext(AuthContext);
    const [voucherNumber, setVoucherNumber] = useState(0);
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [payee, setPayee] = useState("");
    const [details, setDetails] = useState("");
    const [checkDate, setcheckDate] = useState(currentDate);
    const [checkNumber, setCheckNumber] = useState("");
    const [entryTable, setEntryTable] = useState([]);  // Stored Accounts for journal entry
    const [budgetlinedata, setbudgetlinedata] = useState([]);  // List of activities or budgetline
    const [checkedby, setCheckedby] = useState("");
    const [approvedby, setApprovedby] = useState("");
    const [isPrepApproved, setIsPrepApproved] = useState(false);
    const [isCheckApproved, setIsCheckApproved] = useState(false);
    const [isAppApproved, setIsAppApproved] = useState(false);
    const [isComApproved, setIsComApproved] = useState(false);
    const [isAuthApproved, setIsAuthApproved] = useState(false);
    const [isRecNumApproved, setIsRecNumApproved] = useState(false);

    // fetch data from the database and assign the value to the setData variable
    useEffect(() => {
        fetchBudgetLine();
    }, []);

    const fetchBudgetLine = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/activities');
            const data = await response.json();
            if(data.length>0){
                const formattedData = data.map(item => ({
                    value: `${item.activityID}/${item.activityName}`,
                    label: `${item.activityID} ${item.activityName}`
                }));
                setbudgetlinedata(formattedData);
            }else{
                setbudgetlinedata([]);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fethcvoucherNumber();
    }, []);

    const fethcvoucherNumber = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/vouchernumber');
            const data = await response.json();
            setVoucherNumber(parseInt(data.row));
            // console.log("Voucher number: ", data.row);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleAddEntry = () => {
        setEntryTable([...entryTable, { accountCode: "", accountTitle: "", debit: "", credit: "" }]);
    };

    const handleEntryChange = (index, field, selectedOption) => {
        const updatedEntryTable = [...entryTable];
        updatedEntryTable[index][field] = selectedOption;
        setEntryTable(updatedEntryTable);
    };

    const requestData = {
        selectedDate, payee, details, voucherNumber,
        entryTable,
        preparedby: auth.firstname+" "+auth.lastname, checkedby, approvedby,
        status: 'To be Checked'
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:3001/api/createvoucher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                InsertLogData("Voucher created by " + auth.firstname, auth.firstname);
                toast.success('Voucher created successfully', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    hideProgressBar: true,
                });
                setSelectedDate(currentDate);
                setDetails("");
                setPayee("");
                setEntryTable([]);
                setCheckedby("");
                setApprovedby("");
                setVoucherNumber(voucherNumber+1);
            })
            .catch(error => {
                console.log('Error inserting data:', error);
            });

    };

    const handlePreparedSign = () => {
        if (auth) {
            console.log(`Signed by: ${auth}`);
            setIsPrepApproved(true);
        } else {
            console.log('User name is required.');
        }
    };

    const handleCheckedSign = () => {
        setIsCheckApproved(true);
    }

    const handleApprovedSign = () => {
        setIsAppApproved(true);
    }

    const handleCompanySign = () => {
        setIsComApproved(true);
    }

    const handleAuthorizedSign = () => {
        setIsAuthApproved(true);
    }

    const handleRecNumSign = () => {
        setIsRecNumApproved(true);
    }

    const Print = () => {
        //console.log('print');  
        let printContents = document.getElementById('contentprint').innerHTML;
        let originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    }

    console.log("Render Voucher Form");
    return (
        <>
            <div className="create-forms">
                <form onSubmit={handleSubmit}>
                    <div className="contentprint" id="contentprint">
                        <div className="voucher-nyli-logo">
                            <img src={logo} alt="NYLI" />
                            <div className="right-title">
                                <h2>CHECK VOUCHER</h2>
                                <p>NO. {voucherNumber}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <DatePickerInput
                                    label="Date"
                                    selectedDate={selectedDate}
                                    onChange={handleDateChange} />
                            </div>
                            <div className="col-6">
                                <DatePickerInput
                                    label="Check Date"
                                    selectedDate={checkDate}
                                    onChange={handleDateChange}
                                    disabled={true} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <InputText
                                    label="Payee"
                                    id="payee"
                                    type="text"
                                    placeholder="enter payee"
                                    name="payee"
                                    value={payee}
                                    onChange={(e) => setPayee(e.target.value)} />
                            </div>
                            <div className="col-6">
                                <InputText
                                    label="Check Number"
                                    id="checkNumber"
                                    type="text"
                                    placeholder="check number"
                                    name="checkNumber"
                                    value={checkNumber}
                                    onChange={(e) => setCheckNumber(e.target.value)}
                                    disabled={true} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <InputTextArea
                                    label="Details"
                                    id="details"
                                    placeholder="enter details"
                                    name="details"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="add-entry">
                            <button type="button" onClick={handleAddEntry}>Add Account</button>
                        </div>
                        <EntryTable entryData={entryTable} handleEntryChange={handleEntryChange} budgetLineData={budgetlinedata} />
                        <div className="approval-section">
                            <ApprovalComponent
                                header="PREPARED"
                                onSign={handlePreparedSign}
                                userName={auth.firstname+" "+auth.lastname}
                                isApproved={isPrepApproved}
                            />
                            <ApprovalComponent
                                header="CHECKED"
                                onSign={handleCheckedSign}
                                userName={checkedby}
                                isApproved={isCheckApproved}
                                value={checkedby} // Pass the value from the state variable
                                onChange={(e) => setCheckedby(e.target.value)} // Update the state variable on change
                            />
                            <ApprovalComponent
                                header="APPROVED"
                                onSign={handleApprovedSign}
                                userName={approvedby}
                                isApproved={isAppApproved}
                                value={approvedby} // Pass the value from the state variable
                                onChange={(e) => setApprovedby(e.target.value)} // Update the state variable on change
                            />
                        </div>
                        <div className="receive-section">
                            <ReceivedComponent
                                onSign={handleCompanySign}
                                userName="Company/Organization"
                                isApproved={isComApproved}
                            />
                            <ReceivedComponent
                                onSign={handleAuthorizedSign}
                                userName="Authorized Representative"
                                isApproved={isAuthApproved}
                            />
                            <ReceivedComponent
                                onSign={handleRecNumSign}
                                userName="Receipt Number"
                                isApproved={isRecNumApproved}
                            />
                        </div>
                        <div className="nyli">
                            <h4>Negrosanon Young Leaders Institute Inc</h4>
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="submit" className="button-save isNotDisabled">Save</button>
                    </div>
                </form>
            </div>
            {/* <button type="button" onClick={Print} > Print div</button> */}
        </>
    )
}

export default CreateVoucherForm