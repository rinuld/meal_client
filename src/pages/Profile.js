import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthProvider";
import InputText from "../components/utils/InputText";
import Axios from 'axios';

export default function Profile() {
    const { auth } = useContext(AuthContext);
    const [initials, setInitials] = useState('');
    const [id, setID] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (auth && auth.middlename) {
            setInitials(auth.lastname.charAt(0));
            setID(auth.id);
        }
    }, [auth])

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
    
        if (!newPassword || !confirmPassword) {
          console.error('Please fill in all fields');
          return;
        }
    
        if (newPassword !== confirmPassword) {
          console.error('Passwords do not match');
          return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/api/resetPassword', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: auth.email, newPassword }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to reset password');
            }
    
            const data = await response.json();
            console.log(data.message); // Password reset successful message
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.error('Error resetting password:', error);
            // Handle error response from backend, if needed
        }
    };
  
    const handleUpload = async () => {
      if (!selectedFile) {
        alert('Please select an image.');
        return;
      }
  
      const formData = new FormData();
      formData.append('image', selectedFile);
      console.log(selectedFile);
  
      try {
        const response = await Axios.put(`http://localhost:3001/api/updateImage/${id}`, formData);
        console.log(response.data.path);
      } catch (error) {
        console.error(error);
        // Handle error here
      }
    };

    const formatBirthdate = (birthdate) => {
        const date = new Date(birthdate);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    };

    return (
        <>
            <div className="profile-page">
                <div className="row">
                    <div className="col-12 col-lg-3">
                        <div className="create-forms profile-div profile-img">
                            <label>Profile Picture</label>
                            <input className="user-profile" type="file" onChange={handleFileChange}/>
                            <br></br>
                            <button onClick={handleUpload}>Upload Image</button>
                            {/* <p>{auth.firstname} {initials}</p>
                            <p>{auth.role}</p> */}
                        </div>
                        <div className="create-forms profile-div profile-img">
                            <InputText
                                label="New Password"
                                id="newPassword"
                                type="password"
                                placeholder="New Password"
                                name="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <br></br>
                             <InputText
                                label="Confirm New Password"
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm New Password"
                                name="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <br></br>
                            <button onClick={handleResetPassword}>Change Password</button>
                        </div>
                    </div>
                    <div className="col-12 col-lg-9">
                        <div className="create-forms profile-div">
                            <div className="row profile-row">
                                <div className="col-12 col-lg-2 profile-info">
                                    <p>Full Name</p>
                                </div>
                                <div className="col-12 col-lg-10 profile-info-cont">
                                    <p>{auth.firstname} {auth.middlename} {auth.lastname}</p>
                                </div>
                            </div>
                            <div className="row profile-row">
                                <div className="col-12 col-lg-2 profile-info">
                                    <p>Email</p>
                                </div>
                                <div className="col-12 col-lg-10 profile-info-cont">
                                    <p>{auth.email}</p>
                                </div>
                            </div>
                            <div className="row profile-row">
                                <div className="col-12 col-lg-2 profile-info">
                                    <p>Address</p>
                                </div>
                                <div className="col-12 col-lg-10 profile-info-cont">
                                    <p>{auth.address}</p>
                                </div>
                            </div>
                            <div className="row profile-row">
                                <div className="col-12 col-lg-2 profile-info">
                                    <p>Birthdate</p>
                                </div>
                                <div className="col-12 col-lg-10 profile-info-cont">
                                    <p>{formatBirthdate(auth.birthdate)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}