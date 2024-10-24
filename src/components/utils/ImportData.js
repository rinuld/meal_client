import React, { useContext, useState } from 'react';
import axios from 'axios';
import { InsertLogData } from '../InsertLogData';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthProvider';

const ImportData = ({ indicatorDetails, onChange }) => {
  const { auth } = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const indicatorID = indicatorDetails.indicatorID;

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios
        .post(`https://meal-server.negrosanonyoungleaders.org/api/upload/${indicatorID}`, formData)
        .then((response) => {
          // console.log(response.data);
          if(response.data.success){
            InsertLogData("Imported indicator participants", auth.firstname);
            toast.success('Data Imported', {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 1000,
              hideProgressBar: true,
            });
          }
          onChange();
          setSelectedFile(null);
          document.getElementById('file-input').value = null;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  console.log("Render Import");
  return (
    <div className='import-component'>
      <input id="file-input" type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImportData;
