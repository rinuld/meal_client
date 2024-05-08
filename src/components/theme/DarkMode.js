// DarkMode.js
import React, { useEffect } from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";

const setDarkMode = () => {
    document.querySelector("body").setAttribute('data-theme', 'dark');
    localStorage.setItem("selectedTheme", "dark")
};
    
const setLightMode = () => {
    document.querySelector("body").setAttribute('data-theme', 'light');
    localStorage.setItem("selectedTheme", "light")
};

const selectedTheme = localStorage.getItem("selectedTheme")

if (selectedTheme === "dark") {
    setDarkMode();
}

if (selectedTheme === "light") {
    setLightMode();
}

const toggleTheme = (e) => {
    if (e.target.checked) setDarkMode();
    else setLightMode();
};

const DarkMode = () => {
    return null;
};

export { DarkMode, toggleTheme, selectedTheme, Sun, Moon, setDarkMode, setLightMode };
