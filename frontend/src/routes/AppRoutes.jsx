import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Home from "../screens/Home";
import Projects from "../screens/Projects";
import Auth from "../auth/Auth";

const AppRoutes = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Auth>
                <Home />
              </Auth>
            }
          />
          <Route path="/login" element={<Login />} default />
          <Route path="/register" element={<Register />} />
          <Route
            path="/project/:id"
            element={
              <Auth>
                <Projects />
              </Auth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
