import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubmitForgotEmail = () => {
  const [credentials, setCredentials] = useState({ email: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/api/user/send-reset-password-email/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
          }),
        }
      );
      const json = await response.json();
      if (json.msg) {
        console.log("1", json);
        navigate("/");
        alert("Password reset email has been sent");
      } else {
        console.log("Invalid Credentials", json);
        alert("Please Provide Correct Registered Email");
      }
    } catch (error) {
      console.error("Error fetching Information", error);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div className="feild-container flex items-center justify-center h-full w-full">
        <div className="conatin absolute top-1/2 translate-y-[-80%]">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label for="email" className="form-label text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control bg-black text-white"
                id="email"
                aria-describedby="usernameHelp"
                onChange={onChange}
                value={credentials.email}
              />
              <div id="emailHelp" className="form-text text-white">
                Please Enter The Registered Email
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary bg-black text-white w-full mt-2"
            >
              Submit
            </button>
            <p className="text-sm mt-1 text-white">
              By continuing, you will get the Password Reset Link in the
              provided registered email
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SubmitForgotEmail;
