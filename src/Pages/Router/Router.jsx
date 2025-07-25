import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "../Home/HomePage";
import LoginPage from "../Auth/LoginPage";
import RegisterPage from "../Auth/RegisterPage";
import ForgotPasswordPage from "../Auth/ForgotPasswordPage";
import ResetPasswordPage from "../Auth/ResetPasswordPage";
import UserRoleManagement from "../Admin/UserRoleManagement";


const Router = () => {
  return (
    <Routes>
    <Route path="/profile" element={<ProfilePage></ProfilePage>} />
      <Route path="/" element={<Navigate to="/home" />} />{" "}
      {/* Điều hướng mặc định */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />{" "}
      {/* Đặt lại mật khẩu */}
      <Route path="/about" element={<AboutUsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/rooms" element={<RoomManagement />} />
      <Route path="/admin/users" element={<UserManagement />} />
      
    <Route path="/admin/user-role-management" element={<UserRoleManagement />} />

     
    </Routes>
  );
};

export default Router;
