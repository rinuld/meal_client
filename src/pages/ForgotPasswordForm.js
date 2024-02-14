import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate  } from 'react-router-dom';

const ForgotPasswordForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login'); // Navigate to the login page
  };

  const onSubmit = (data) => {
    // Handle form submission (e.g., send email for password reset)
    console.log(data);
  };

  return (
    <section>
      <div className='form-box'>
        <div className='form-value'>
          <form onSubmit={handleSubmit(onSubmit)}>
            {errors.email && <p className={errors ? "errmsg" : "offscreeen"}>{errors.email.message}</p>}
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
            </div>
            <button className='login-btn' type="submit">Reset Password</button>
            <button className='login-btn' onClick={handleBackToLogin}>Back to Login</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;