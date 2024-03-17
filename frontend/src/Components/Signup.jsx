import React ,{useState} from "react";
import defaultProfile from "../assets/profiledefault.png"
import { useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../Services/userAuthapi'
import { storeToken } from '../Services/localStorageServices';

import { Link } from "react-router-dom";
const Signup = () => {
  
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/user/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
          password2: credentials.password2,
        }),
      });
      const json = await response.json();
      console.log(json);
      if (json.token) {
        localStorage.setItem("token", JSON.stringify(json.token));
        // window.location.href = "/feed";
        navigate('/feed')
        console.log("if ke andar wala success consile")
      } else {
        console.log("Invalid Credentials if ke andar",json);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div className="container">
        <h2 className="text-2xl text-center font-bold">Create an account</h2>
        <form className="mt-2" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label for="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control bg-black text-white"
              id="username"
              name="username"
              aria-describedby="usernameHelp"
              placeholder="Enter-Username"
              onChange={onChange}
              value={credentials.username}
            />
          </div>
          <div className="mb-3">
            <label for="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control bg-black text-white"
              id="email"
              name="email"
              aria-describedby="emailHelp"
              placeholder="Enter-Email"
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
              type="password"
              name="password"
              className="form-control bg-black text-white"
              id="exampleInputPassword1"
              onChange={onChange}
              value={credentials.password}
            />
          </div>
          <div className="mb-3">
            <label for="exampleInputPassword2" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password2"
              className="form-control bg-black text-white"
              id="exampleInputPassword2"
              onChange={onChange}
              value={credentials.password2}
            />
          </div>
          {/* <div className="flex items-center justify-center text-center flex-col gap-2">
            <label htmlFor="myImage" className="form-label text-xl font-bold text-gray-800">
              Profile Picture
            </label>
            <div className="flex items-center flex-col justify-center gap-3">
            {selectedImage ? (
                <div className="">
                  <img
                    alt="Uploaded"
                    width={"50px"}
                    height={"50px"}
                    className="rounded-circle"
                    src={URL.createObjectURL(selectedImage)}
                  />
                  <br />
                  <button onClick={() => setSelectedImage(null)}>Remove</button>
                </div>
              ) : (
                <img
                  alt="Default"
                  width={"50px"}
                  height={"50px"}
                  className="rounded-circle"
                  src={defaultProfile}
                />
              )}
              <input
              className="ml-[6.5vw]"
                type="file"
                name="myImage"
                id="myImage"
                onChange={(event) => {
                  console.log(event.target.files[0]);
                  setSelectedImage(event.target.files[0]);
                }}
              />
            </div>
          </div> */}
          <button
            type="submit"
            className="btn btn-primary bg-black text-white w-full mt-2"
          >
            SignUp
          </button>
          <p className="text-sm mt-1 text-grey-900">
            By continuing, you agree to Connectify’s Terms of Service and
            acknowledge you've read the Privacy Policy
          </p>
          <Link to="/">Already hane an account?</Link>
        </form>
      </div>
    </>
  );
};

export default Signup;
