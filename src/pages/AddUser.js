import { useState } from "react"
import InputText from "../components/utils/InputText";
import InputSelection from "../components/utils/InputSelection";
import { InsertLogData } from "../components/InsertLogData";
import { Flip, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';
import emailjs from "@emailjs/browser";


export default function AddUser() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [sex, setSex] = useState({});
  const [email, setEmail] = useState("");
  const [role, setRole] = useState({});
  const [password, setDefaultPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Format the date as yyyy/MM/dd
    const formattedDate = birthdate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');

    fetch('http://localhost:3001/api/insertUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ 
        firstname, 
        lastname, 
        middlename, 
        address, 
        sex: sex.value, 
        birthdate: formattedDate,
        email, 
        role: role.value, 
        password 
      }),
    })
      .then(response => response.text())
      .then(data => {
        setFirstname("");
        setLastName("");
        setEmail("");
        setMiddleName("");
        setAddress("");
        setRole({});
        setSex({});
        setBirthdate(new Date());
        setDefaultPassword("");
        InsertLogData("Added new member " + firstname + " " + lastname);
        toast.success('Member Added', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Flip,
        });

        console.log(birthdate);
        console.log('Formatted Date:', formattedDate);

        // emailjs.sendForm('service_j7vp4dc', 'template_iuxhn7x', e.target, 'RdZBEODH7uDlfD4ME');
      })
      .catch(error => {
        toast.error(('Error inserting data:', error), {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Flip,
        });
        // console.log('Error inserting data:', error);
      });
  };

  const selectSex = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];

  const selectRole = [
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Admin', label: 'Admin' },
    { value: 'Finance Officer', label: 'Finance Officer' },
    { value: 'Member', label: 'Member' },
  ];

  return (
    <>
      <div className="create-forms">
        <form onSubmit={handleSubmit}>
          <div className="row gx-3">
            <div className="col-12 col-md-4">
              <InputText
                label="First Name"
                id="firstname"
                type="text"
                placeholder="Enter First Name"
                name="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <InputText
                label="Last Name"
                id="lastname"
                type="text"
                placeholder="Enter Last Name"
                name="lastname"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <InputText
                label="Middle Name"
                id="middlename"
                type="text"
                placeholder="Enter Middle Name"
                name="middlename"
                value={middlename}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
          </div>
          <div className="row gx-3">
            <div className="col-12 col-md-6">
              <InputText
                label="Address"
                id="address"
                type="text"
                placeholder="Enter Address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="col-3">
              <InputSelection
                label="Sex"
                value={sex}
                data={selectSex}
                onChange={(e) => setSex(e)}
              />
            </div>
            <div className="col-3">
              <label htmlFor="Birthdate">Birthdate</label><br></br>
              <DatePicker
                className='input-text'
                selected={birthdate}
                onChange={(date) => setBirthdate(date)}
                dateFormat="yyyy/MM/dd"
              />
            </div>
            
          </div>
          <div className="row gx-3">
            <div className="col-12 col-md-6">
              <InputText
                label="Email Address"
                id="email"
                type="text"
                placeholder="Enter Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <InputSelection
                label="Role"
                value={role}
                data={selectRole}
                onChange={(e) => setRole(e)}
              />
            </div>
            <div className="col-12 col-md-3">
              <InputText
                label="Password"
                id="password"
                type="text"
                placeholder="Enter Password"
                name="password"
                value={password}
                onChange={(e) => setDefaultPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="button-container">
            <button type="submit" className="button-save isNotDisabled">Save</button>
          </div>
        </form>
      </div>
    </>
  )
}