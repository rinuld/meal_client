import { useState } from "react"
import InputText from "../components/utils/InputText";
import InputSelection from "../components/utils/InputSelection";
import { InsertLogData } from "../components/InsertLogData";
import { toast } from "react-toastify";


export default function AddUser() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState({});
  const [password, setDefaultPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/api/insertUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstname, lastname, middlename, email, role: role.value, password }),
    })
      .then(response => response.text())
      .then(data => {
        setFirstname("");
        setLastName("");
        setEmail("");
        setRole({});
        setDefaultPassword("");
        InsertLogData("Added new member " + firstname + " " + lastname);
        toast.success('Member Added', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
          hideProgressBar: true,
        });
      })
      .catch(error => {
        console.log('Error inserting data:', error);
      });
  };

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
          <div className="row">
            <div className="col-4">
              <InputText
                label="First Name"
                id="firstname"
                type="text"
                placeholder="enter firstname"
                name="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="col-4">
              <InputText
                label="Last Name"
                id="lastname"
                type="text"
                placeholder="enter last name"
                name="lastname"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="col-4">
              <InputText
                label="Middle Name"
                id="middlename"
                type="text"
                placeholder="enter middlename"
                name="middlename"
                value={middlename}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <InputText
                label="E-mail"
                id="email"
                type="text"
                placeholder="enter email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="col-6">
              <InputSelection
                label="Role"
                value={role}
                data={selectRole}
                onChange={(e) => setRole(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <InputText
                label="Default Password"
                id="password"
                type="text"
                placeholder="enter password"
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