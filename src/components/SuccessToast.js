import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SuccessToast(message){
    toast.success(message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        hideProgressBar: true,
      });      
}