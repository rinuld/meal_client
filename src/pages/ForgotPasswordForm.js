import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import emailjs from "@emailjs/browser";

const ForgotPasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const navigate = useNavigate();

  const generateVerificationCode = (length) => {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      code += charset[randomIndex];
    }
    return code;
  };

  const handleSendVerificationCode = () => {
    // Validate email field
    const isValid = validateEmail();
    if (!isValid) {
      return;
    }

    // Generate verification code to send through email
    const email = document.getElementById('email').value;
    const code = generateVerificationCode(6); // Change 6 to customize the code length
    setVerificationCode(code);
    console.log(code);

    // Store verification code in local storage
    localStorage.setItem('verificationCode', code);
    localStorage.setItem('email', email);
    
    // Set expiration time (5 minutes)
    setTimeout(() => {
      localStorage.removeItem('verificationCode');
    }, 300000); // 300 seconds in milliseconds

    // Set cooldown
    setCooldown(true);
    setCooldownSeconds(300);
    setTimeout(() => {
      setCooldown(false);
    }, 300000); // 300 seconds in milliseconds

    // Send email using emailJS
    const templateParams = {
      email: email,
      verificationCode: code
    };

    setVerificationSent(true);

    // emailjs.send('service_j7vp4dc', 'template_rr8idxc', templateParams, 'RdZBEODH7uDlfD4ME')
    //   .then(() => {
    //     setVerificationSent(true); // Set verificationSent to true after sending email
    //   })
    //   .catch((error) => {
    //     console.error('Email sending failed:', error);
    //   });

  };

  const validateEmail = () => {
    const email = document.getElementById('email').value;
    if (!email) {
      console.error('Email is required');
      return false;
    }
    // Regular expression for validating email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      console.error('Invalid email format');
      return false;
    }
    return true;
  };

  useEffect(() => {
    let cooldownTimer;
    if (cooldown) {
      cooldownTimer = setInterval(() => {
        setCooldownSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            clearInterval(cooldownTimer);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownTimer);
  }, [cooldown]);

  const handleVerify = () => {
    const storedVerificationCode = localStorage.getItem('verificationCode');
    const storedEmail = localStorage.getItem('email');
    const codeInput = document.getElementById('verificationCode').value;
    const email = document.getElementById('email').value;
    if (!email || !codeInput) {
      console.error('Email and verification code are required');
      return;
    }
    if (email !== storedEmail) {
      console.error('Entered email does not match the one used to send the verification code');
      return;
    }
    if (!storedVerificationCode) {
      console.error('Verification code has expired');
      return;
    }
    if (codeInput !== storedVerificationCode) {
      console.error('Invalid verification code');
      return;
    }
    // Verification successful, navigate to reset password page
    navigate('/reset-password');
  };

  const handleBackToLogin = () => {
    navigate('/'); // Navigate to the login page
  };

  const onSubmit = () => {
    // No need for submission logic in this component
  };

  return (
    <section>
      <div className='form-box'>
        <div className='form-value'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h2 className='login-h2'>Forgot Password</h2>
            <div className="inputbox">
              <i className="fa fa-envelope"></i>
              <input
                type="email"
                id="email"
                autoComplete="off"
                {...register('email', { required: 'Email is required' })}
              />
              <label htmlFor='email'>Email Address</label>
              {errors.email && <p className="errmsg">{errors.email.message}</p>}
            </div>
            <div className="inputbox">
              <i className="fa fa-key"></i>
              <input
                type="text"
                id="verificationCode"
                autoComplete="off"
              />
              <label htmlFor='verificationCode'>Verification Code</label>
            </div>
            <button className='login-btn' type="button" onClick={handleSendVerificationCode} disabled={cooldown}>
              {cooldown ? `Resend in ${cooldownSeconds} seconds` : 'Send Verification Code'}
            </button>
            {verificationSent && (
              <button className='login-btn' type="button" onClick={handleVerify}>Verify</button>
            )}
            <button className='login-btn' onClick={handleBackToLogin}>Back to Login</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;