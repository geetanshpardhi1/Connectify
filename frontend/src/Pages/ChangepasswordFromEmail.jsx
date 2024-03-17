import React, { useState } from "react";
import { useNavigate , useParams } from "react-router-dom";

const ChangepasswordFromEmail = () => {
  const {uid ,token} = useParams(); 
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    password: "",
    password2: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/user/reset-password/${uid}/${token}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: credentials.password,
            password2: credentials.password2,
          }),
        }
      );
      const json = await response.json();
      if (json.msg) {
        console.log(json);
        alert("Password has been updated");
        navigate ("/")
      } else {
        console.log("Invalid Credentials", json);
        alert("Error Updating password");
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
              <label for="password" className="form-label text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-control bg-black text-white"
                id="password"
                aria-describedby="passwordHelp"
                onChange={onChange}
                value={credentials.password}
              />
              <div id="passwordHelp" className="form-text text-white">
                Enter the new password
              </div>
            </div>
            <div className="mb-3">
              <label for="password" className="form-label text-white">
                Confirm Password
              </label>
              <input
                type="password"
                name="password2"
                className="form-control bg-black text-white"
                id="password2"
                aria-describedby="passwordHelp"
                onChange={onChange}
                value={credentials.password2}
              />
              <div id="passwordHelp" className="form-text text-white">
                Confirm the new password
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary bg-black text-white w-full mt-2"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangepasswordFromEmail;
