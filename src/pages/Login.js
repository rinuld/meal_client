import React, { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import '../assets/css/login.css';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import AuthContext from '../context/AuthProvider';
import ReCAPTCHA from "react-google-recaptcha";

const Login = ({ setToken }) => {
  const { setAuth } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [recaptchaValue, setRecaptchaValue] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    const storedCredentials = localStorage.getItem('rememberedCredentials');
    if (storedCredentials) {
      setStoredCredentials(JSON.parse(storedCredentials));
    }
  }, []);

  const handleLogin = async (data) => {
    try {
      const response = await Axios.post('http://localhost:3001/api/login', { ...data, recaptchaValue });
      const { token, user } = response.data;
      setToken({ token: token });
      setAuth(user);
      navigate("/projects");

      if (rememberMe) {
        localStorage.setItem('rememberedCredentials', JSON.stringify({ username: data.username, password: data.password }));
      } else {
        localStorage.removeItem('rememberedCredentials');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
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
                value={storedCredentials.username}
                onChange={(e) => setStoredCredentials({ ...storedCredentials, username: e.target.value })}
              />
              <label htmlFor='username'>Username</label>
            </div>
            <div className="inputbox">
              <i className="fa fa-lock"></i>
              <input
                type="password"
                id="password"
                {...register('password', { required: 'Password is required' })}
                value={storedCredentials.password}
                onChange={(e) => setStoredCredentials({ ...storedCredentials, password: e.target.value })}
              />
              <label htmlFor='password'>Password</label>
            </div>
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <label htmlFor="rememberMe" style={{ color: 'white' }}>Remember me</label>
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
};

export default Login;
