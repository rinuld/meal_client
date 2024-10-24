import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem('email');

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
      const response = await fetch('https://meal-server.negrosanonyoungleaders.org/api/resetPassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: storedEmail, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      const data = await response.json();
      console.log(data.message); // Password reset successful message
      localStorage.removeItem('email');
      navigate('/');
    } catch (error) {
      console.error('Error resetting password:', error);
      // Handle error response from backend, if needed
    }
  };

  const handleBackToLogin = () => {
    localStorage.removeItem('email');
    navigate('/'); // Navigate to the login page
  };

  return (
    <section>
      <div className="container" style={{width: '30%'}}>
        <div className="login-forms">
          <div className="row gx-3">
            <div className="col-12 col-md-7 ls-row1"></div>
              <div className='form-box'>
                <div className='form-value'>
                  <form onSubmit={handleResetPassword}>
                    <h2 style={{textAlign: 'center', color: '#106544'}}>Reset Password</h2>
                    <div className="inputbox">
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      
                      <label htmlFor='newPassword'>New Password</label>
                      
                    </div>
                    <div className="inputbox">
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <label htmlFor='confirmPassword'>Confirm Password</label>
                    </div>
                    <button className='login-btn-main' type="submit">Reset Password</button>
                    <button className='login-btn-main' onClick={handleBackToLogin}>Back to Login</button>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordForm;
