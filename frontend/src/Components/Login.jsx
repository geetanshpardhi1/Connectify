import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      const json = await response.json();
      if (json.token) {
        console.log(json);
        localStorage.setItem("token", JSON.stringify(json.token));
        navigate ("/feed")
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="container">
        <h2 className="text-2xl text-center font-bold">Welcome Back</h2>
        <form className="mt-2" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label for="email" className="form-label">
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
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="form-control bg-black text-white"
              id="exampleInputPassword1"
              onChange={onChange}
              value={credentials.password}
            />
          </div>
          <div className="flex flex-col mt-0">
            <Link to='/submitForgotEmail' className="text-center my-2">Forgot your password?</Link>
            <Link className="text-center">Don't Have an account? Sign up</Link>
          </div>
          <button
            type="submit"
            className="btn btn-primary bg-black text-white w-full mt-2"
          >
            Login
          </button>
          <p className="text-sm mt-1 text-grey-900">
            By continuing, you agree to Connectify’s Terms of Service and
            acknowledge you've read the Privacy Policy
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
