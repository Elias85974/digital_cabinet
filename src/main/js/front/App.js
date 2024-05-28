import { NativeRouter, Route, Routes } from "react-router-native";

import HomePage from "./app/tabs/HomePage";
import Homes from "./app/tabs/Homes";
import LoginPage from "./app/tabs/LoginPage";
import LogoutButton from "./app/tabs/LogoutButton";
import RegisterHome from "./app/tabs/RegisterHome";
import RegisterPage from "./app/tabs/RegisterPage";
import RegisterProduct from "./app/tabs/RegisterProduct";
import Index from "./app/index";
import React from "react";

export default function App() {
    return (
        <NativeRouter>
            <Routes>
                <Route path="/" element={<Index/>} />
                <Route path="/Index" element={<Index/>} />
                <Route path="/HomePage" element={<HomePage/>} />
                <Route path="/Homes" element={<Homes/>} />
                <Route path="/LoginPage" element={<LoginPage/>} />
                <Route path="/LogoutButton" element={<LogoutButton/>} />
                <Route path="/RegisterHome" element={<RegisterHome/>} />
                <Route path="/RegisterPage" element={<RegisterPage/>} />
                <Route path="/RegisterProduct" element={<RegisterProduct/>} />

            </Routes>
        </NativeRouter>
    );
}