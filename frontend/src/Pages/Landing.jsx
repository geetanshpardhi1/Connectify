import React, { useState } from "react";
import logo_1 from "../assets/logo-1-landing.png";
import bg_1 from "../assets/left bg landing.png";
import bg_2 from "../assets/right-bg-langing.png";
import { Link } from "react-router-dom";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import "../index.css";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleComponent = () => {
    if (showLogin ? setShowLogin(false) : setShowLogin(true));
  };

  return (
    <>
      <div className="main-container h-screen w-screen">
        <div className= "content-main bg-black h-full w-full relative flex items-center justify-evenly p-5">
          <div className="left relative w-full">
            <img
              className="absolute w-[30vw] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
              src={bg_1}
              alt=""
            />
            <div className="left-c flex flex-col items-center justify-center gap-4 h-full w-full relative z-[1]">
              <h2 className="text-white text-5xl text-bold">CONNECTIFY</h2>
              <img className="w-[5vw]" src={logo_1} alt="logo" />
              <h4 className="text-white text-2xl">Connecting People</h4>
              <div className="button-top text-white mt-5">
                <button className="px-4 text-bold text-2xl">Dark</button>
                <button className="px-4 tetx-bold text-2xl">Light</button>
              </div>
            </div>
          </div>
          <div className="right relative bg-[url('./assets/right-bg-landing.png')] bg-center bg-no-repeat bg-cover flex items-center justify-center w-full">
            <img
            className="absolute w-[80%]"
            src={bg_2}
            alt=""
          />
            <div className="right-c bg-white flex flex-col items-center justify-center overflow-hidden gap-4 h-full relative z-[1] rounded-3xl lg:w-1/2 ">
              <div className="top bg-black w-full text-white h-[3rem] flex items-center justify-evenly text-center pt-3">
                <Link
                  onClick={handleToggleComponent}
                  className={showLogin ? "active" : ""}
                  to="/"
                  style={{ padding: "50px", width: "50%" }}
                >
                  <button>LOGIN</button>
                </Link>
                <Link
                  onClick={handleToggleComponent}
                  className={!showLogin ? "active" : ""}
                  to="/"
                  style={{ padding: "50px", width: "50%" }}
                >
                  <button>SIGNUP</button>
                </Link>
              </div>
              {showLogin ? <Login /> : <Signup />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
