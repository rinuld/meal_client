import React, { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import '../assets/css/login.css';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import AuthContext from '../context/AuthProvider';
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from 'react-toastify';

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
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
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
      <div className="container">
        <div className="login-forms">
          <div className="row gx-3">
            <div className="col-12 col-md-7 ls-row1">
              <div className='form-box'>
                <div className='form-value'>
                  <form onSubmit={handleSubmit(handleLogin)}>
                    {errors.username && (
                      toast.error("Username is required.", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      })
                    )}
                    {errors.password && (
                      toast.error("Password is required.", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      })
                    )}
                    {/* {errors.password && <p className={errors ? "errmsg" : "offscreeen"}>{errors.password.message}</p>} */}
                    <h2 className='login-h2'></h2>
                    <div className="inputbox">
                      <i className="fa fa-user"></i>
                      <input
                        style={{ paddingLeft: '25px'}}
                        type="text"
                        id="username"
                        autoComplete="off"
                        {...register('username', { required: true })}
                        // {...register('username', { required: 'Username is required' })}
                        value={storedCredentials.username}
                        onChange={(e) => setStoredCredentials({ ...storedCredentials, username: e.target.value })}
                      />
                      <label htmlFor='username'>Username</label>
                    </div>
                    <div className="inputbox">
                      <i className="fa fa-lock"></i>
                      <input
                        style={{ paddingLeft: '25px'}}
                        type="password"
                        id="password"
                        {...register('password', { required: true })}
                        // {...register('password', { required: 'Password is required' })}
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
                      <label htmlFor="rememberMe" className="remember-me-txt"><p>Remember me</p></label>
                    </div>
                    <ReCAPTCHA
                      sitekey="6LdBamQqAAAAAG7Dj1Gk27cFltyRy7-0iFcb49to"
                      onChange={(value) => {
                        setRecaptchaValue(value);
                      }}
                    />
                    <button className='login-btn-main' type="submit">Login</button>
                    <Link to="/forgot-password" className="forgot-password-txt"><p>Forgot your password?</p></Link>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 login-col ls-row2">
              <img src={require('../assets/images/favicon.png')} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};

export default Login;
