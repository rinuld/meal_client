import React, { useState, useContext } from 'react';
// import AuthContext from '../context/AuthProvider';
import Axios from 'axios';
import '../assets/css/login.css';
// import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import AuthContext from '../context/AuthProvider';
import ReCAPTCHA from "react-google-recaptcha";

export default function Login({ setToken }) {
  const { setAuth } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [recaptchaValue, setRecaptchaValue] = useState("")

  const handleLogin = async (data) => {
    // console.log(data);
    try {
      const response = await Axios.post('http://localhost:3001/api/login', { ...data, recaptchaValue});
      const { token, user } = response.data;
        // Save session token and user information in local storage or cookies
        localStorage.setItem('token', JSON.stringify({ token: token }));
        localStorage.setItem('user', JSON.stringify(user));
        setToken({ token: token });
        // console.log(token, user);
        // console.log(recaptcha);
        setAuth(user);
        navigate("/projects");
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <section>
      <div className='form-box'>
        <div className='form-value'>
          <form onSubmit={handleSubmit(handleLogin)}>
            {errors.username && <p className={errors ? "errmsg" : "offscreeen"}>{errors.username.message}</p>}
            {errors.password && <p className={errors ? "errmsg" : "offscreeen"}>{errors.password.message}</p>}
            <h2 className='login-h2'>Sign In</h2>
            <div className="inputbox">
              <i className="fa fa-user"></i>
              <input
                type="text"
                id="username"
                autoComplete="off"
                {...register('username', { required: 'Username is required' })}
              />
              <label htmlFor='username'>Username</label>
            </div>
            <div className="inputbox">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                id="password"
                {...register('password', { required: 'Password is required' })}
              />
              <label htmlFor='password'>Password</label>
            </div>
            <Link to="/forgot-password">Forgot Password?</Link>
            <ReCAPTCHA
              sitekey="6LcrxOImAAAAAHTHpKc7Rjb0cUmsM6xaYzjBO_HX"
              onChange={(value) => {
                setRecaptchaValue(value);
              }}
            />
            <button className='login-btn' type="submit">Login</button>
          </form>
        </div>
      </div>
    </section>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}