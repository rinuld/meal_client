import { useContext, useEffect, useState } from "react"
import AuthContext from "../context/AuthProvider";
import Axios from 'axios';

export default function Profile() {
    const { auth } = useContext(AuthContext);
    const [initials, setInitials] = useState('');
    const [id, setID] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (auth && auth.middlename) {
            setInitials(auth.lastname.charAt(0));
            setID(auth.id);
        }
    }, [auth])

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
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

    return (
        <>
            <div className="profile-page">
                <div className="row">
                    <div className="col-12 col-lg-3">
                        <div className="create-forms profile-div profile-img">
                            <input className="user-profile" type="file" onChange={handleFileChange} />
                            <button onClick={handleUpload}>Upload Image</button>
                            {/* <p>{auth.firstname} {initials}</p>
                            <p>{auth.role}</p> */}
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
                                    <p>{auth.birthdate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}