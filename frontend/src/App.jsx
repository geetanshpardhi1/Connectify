import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Feed from "./Pages/Feed";
import Profile from "./Pages/Profile";
import SubmitForgotEmail from "./Pages/SubmitForgotEmail";
import ChangepasswordFromEmail from "./Pages/ChangepasswordFromEmail";

const App = () => {
  return (
    <>
      <Router>
        <div className="">
          <Routes>
            <Route exect path="/" element={<Landing />}></Route>
            <Route exect path="/feed" element={<Feed />}></Route>
            <Route exect path="/profile" element={<Profile />}></Route>
            <Route exect path="/submitForgotEmail" element={<SubmitForgotEmail/>}></Route>
            <Route exect path="/api/user/reset-password/:uid/:token" element={<ChangepasswordFromEmail/>}></Route>
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
