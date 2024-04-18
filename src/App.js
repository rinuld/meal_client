import './App.css';
import SideBar from './components/SideBar';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import React, { useContext, useEffect, useState } from 'react';
import AuthContext from './context/AuthProvider';
import ProjectContext, { ProjectProvider } from './context/ProjectProvider';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Details from './pages/Details';
import Activity from './pages/Activities';
import Voucher from './pages/Vouchers';
import Indicators from './pages/Indicators';
import ActivityDetails from './pages/ActivityDetails';
import IndicatorDetails from './pages/IndicatorDetails';
import Header from './components/Header';
import SelectionProject from './components/SelectionProject';
import Logs from './pages/Logs';
import useToken from './components/token/UseToken';
import AddUser from './pages/AddUser';
import Profile from './pages/Profile';
import ForgotPasswordForm from './pages/ForgotPasswordForm';
import ResetPasswordForm from './pages/ResetPasswordForm';


export default function App() {
    const { auth, setAuth } = useContext(AuthContext);
    const { token, setToken } = useToken();
    const { project, setProject } = useContext(ProjectContext);

    useEffect(() => {
        const usersession = localStorage.getItem('user');
        if (usersession != null) {
        setAuth(JSON.parse(usersession));
        }
    }, []);

    const handleProjectSelection = (value) => {
        setProject(value);
    };

    console.log("Role: " + auth.role);
    return (
        <>
        <Routes>
            <Route
                path="/forgot-password"
                element={
                    <ForgotPasswordForm />
                }
            />
            <Route
                path="/reset-password"
                element={
                    <ResetPasswordForm />
                }
            />
        </Routes>
        {token ? (
            <>
                <NavBar auth={auth} />
                <div className="container-fluid bg-light d-flex flex-column">
                    <div className="row flex-grow-1">
                        <div className="col-lg-2">
                            <SideBar auth={auth} />
                        </div>
                        <div className="col-lg-10 overflow-auto">
                            <div className="main-content">
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <div>
                                                <Header title="Dashboard" />
                                                <Dashboard />
                                            </div>
                                        }
                                    />
                                    <Route
                                        path="/projects"
                                        element={
                                            <div>
                                                <Header title="Projects" />
                                                <Projects />
                                            </div>
                                        }
                                    />
                                    <Route
                                        path="/details"
                                        element={
                                            <div>
                                                <Header title="Details" />
                                                <SelectionProject onChange={handleProjectSelection}/>
                                                <Details />
                                            </div>
                                        }
                                    />
                                    <Route
                                        path="/activities"
                                        element={
                                            <div>
                                                <Header title="Activities" />
                                                <SelectionProject onChange={handleProjectSelection}/>
                                                <Activity />
                                            </div>
                                        }
                                    />
                                    <Route
                                        path="/indicators"
                                        element={
                                            <div>
                                                <Header title="Indicators" />
                                                <SelectionProject onChange={handleProjectSelection}/>
                                                <Indicators />
                                            </div>
                                        }
                                    />

                                    {auth.role === "Super Admin" && (
                                        <Route
                                            path="/voucher"
                                            element={
                                                <div>
                                                    <Header title="Voucher" />
                                                    <Voucher />
                                                </div>
                                            }
                                        />
                                    )}
                                    <Route
                                        path="/logs"
                                        element={
                                            <div>
                                                <Header title="Logs" />
                                                <Logs />
                                            </div>
                                        }
                                    />
                                    <Route
                                        path="/indicatorDetails/:id"
                                        element={
                                            <div>
                                                <IndicatorDetails />
                                            </div>
                                        }
                                    />
                                    <Route
                                        path="/activityDetails/:id"
                                        element={
                                            <div>
                                                <ActivityDetails />
                                            </div>
                                        }
                                    />
                                    <Route
                                        path="/addmember"
                                        element={
                                            <div>
                                                <Header title="Members" />
                                                <AddUser />
                                            </div>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            <div>
                                                <Header title="Profile" />
                                                <Profile />
                                            </div>
                                        }
                                    />
                                </Routes>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <Routes>
                <Route path="/" element={<Login setToken={setToken} />} />
            </Routes>
        )}
        </>
        
    );
}