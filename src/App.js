import "./App.css";
import About from "./components/About";
import Search from "./components/search/search";
import Detail from "./components/detail";
import Register from "./components/RegistrationPage";
import Login from "./components/LoginPage";
import Profile from "./components/ProfilePage";
import Contact from "./components/Contact";
import Top from "./components/top";
import Feed from "./components/Feed";
import Home from "./components/Home";

import ReviewsHistory from "./components/ReviewsHistory";

import Navigation from "./components/NavigationBar";
import Authenticated from "./components/auth/AuthenticatedOnly";
import Guest from "./components/auth/GuestOnly";

import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import logo from "./nps.png";

function App() {
  return (
    <>
      <div className="App">
        <Navigation />

        <body>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            <Route path="/search" element={<Search />} />
            <Route path="/park/:parkCode" element={<Detail />} />
            {/* <Route path="/user/register" element={<Register />} /> */}
            <Route
              path="/user/register"
              element={<Guest component={Register} />}
            />

            {/* <Route path="/user/login" element={<Login />} /> */}
            <Route path="/user/login" element={<Guest component={Login} />} />

            {/* <Route path="/user/profile" element={<Profile />} /> */}
            <Route
              path="/user/profile"
              element={<Authenticated component={Profile} />}
            />
            <Route
              path="/user/reviews"
              element={<Authenticated component={ReviewsHistory} />}
            />
            {/* <Route path="/contact" element={<Contact />} /> */}
            <Route path="/top" element={<Top />} />
            <Route path="/feed" element={<Feed />} />
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </body>
      </div>
    </>
  );
}

export default App;
