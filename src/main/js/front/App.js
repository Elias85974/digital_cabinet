import {BrowserRouter, Routes, Route} from "react-router-dom"

import HomePage from "./app/tabs/HomePage";
import Homes from "./app/tabs/Homes";
import LoginPage from "./app/tabs/LoginPage";
import LogoutButton from "./app/tabs/LogoutButton";
import RegisterHome from "./app/tabs/RegisterHome";
import RegisterPage from "./app/tabs/RegisterPage";
import RegisterProduct from "./app/tabs/RegisterProduct";
import React from "react-native";


export default function App() {
    return <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>aguante lab 1 !!</div>}/>
                <Route path="/HomePage" element={<HomePage/>}/>
                <Route path="/Homes" element={<Homes/>}/>
                <Route path="/Login" element={<LoginPage/>}/>
                <Route path="/Logout" element={<LogoutButton/>}/>
                <Route path="/Register" element={<RegisterHome/>}/>
                <Route path="/RegisterPage" element={<RegisterPage/>}/>
                <Route path="/RegisterProduct" element={<RegisterProduct/>}/>
            </Routes>
    </BrowserRouter>
}