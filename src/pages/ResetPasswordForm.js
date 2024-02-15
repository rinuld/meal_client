import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = () => {
    // Perform logic to reset password (e.g., send new password)
    // For now, just log the new password
    console.log('New Password:', newPassword);
    console.log('Confirm Password:', confirmPassword);
  };

  const handleBackToLogin = () => {
    navigate('/login'); // Navigate to the login page
  };

  const onSubmit = () => {
    // Handle form submission (e.g., send new password)
    // No need for submission logic in this component
  };

  return (
    <section>
      <div className='form-box'>
        <div className='form-value'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className='login-h2'>Reset Password</h2>
            <div className="inputbox">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label htmlFor='newPassword'>New Password</label>
            </div>
            <div className="inputbox">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor='confirmPassword'>Confirm Password</label>
            </div>
            <button className='login-btn' type="submit" onClick={handleResetPassword}>Reset Password</button>
            <button className='login-btn' onClick={handleBackToLogin}>Back to Login</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordForm;