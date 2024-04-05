import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Story from "../Components/Story/Story";
import Feeds from "../Components/Feeds/Feeds";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { Link } from "react-router-dom";
import profileDefault from "../assets/profiledefault.png";
import Addnewpost from "../Components/Posts/Addnewpost";

export default function IndexPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(false);
  const [menu, setMenu] = useState(false);
  const [menu1, setMenu1] = useState(false);
  const [menu2, setMenu2] = useState(false);
  const [menu3, setMenu3] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImg, setProfileImg] = useState(profileDefault);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [showPendingRequests, setShowPendingRequests] = useState(false);
  const [requests, setRequests] = useState([]);

  const togglePendingRequests = () => {
    setShowPendingRequests(!showPendingRequests);
  };

  useEffect(() => {
    const tokenString = localStorage.getItem("token");

    if (!tokenString) {
      navigate("/");
      return;
    }

    const tokenObject = JSON.parse(tokenString);
    let accessToken = tokenObject.access;

    fetch("http://localhost:8000/api/user/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch user details");
        }
      })
      .then((data) => {
        console.log(data);
        setProfileName(data.username);
        setProfileImg(`http://127.0.0.1:8000/${data.profile_img}`);
      })
      .catch((error) => {
        console.error("Error:", error);
        navigate("/");
      });
  }, []);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      const tokenString = localStorage.getItem("token");
      try {
        const tokenObject = JSON.parse(tokenString);
        let accessToken = tokenObject.access;
        const refreshToken = tokenObject.refresh;
        const response = await fetch(
          "http://localhost:8000/api/friends/pending-requests/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleLogout = async () => {
    const tokenString = localStorage.getItem("token");
    const tokenObject = JSON.parse(tokenString);
    let accessToken = tokenObject.access;
    const refreshToken = tokenObject.refresh;
    await fetch("http://localhost:8000/api/user/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("token");
          setProfileName("");
          console.log("Logout successful");
          navigate("/");
        } else {
          console.error("Logout failed");
        }
      })
      .catch((error) => console.error("Error:", error));
  };
  const handleNewPost = () => {
    setShowNewPostForm(true);
  };

  const handleCloseNewPostForm = () => {
    setShowNewPostForm(false);
  };

  const sendFriendRequest = async () => {
    const tokenString = localStorage.getItem("token");
    try {
      const tokenObject = JSON.parse(tokenString);
      let accessToken = tokenObject.access;
      const refreshToken = tokenObject.refresh;
      const response = await fetch(
        "http://localhost:8000/api/friends/friend-request/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ recipient }),
        }
      );
      const data = await response.json();
      console.log(data);
      setMessage(data.msg || data.detail);
    } catch (error) {
      setMessage(error.msg || error.detail);
    }
  };

  const acceptRequest = async (sender, profileName) => {
    // <-- Add parameters here
    const tokenString = localStorage.getItem("token");
    try {
      const tokenObject = JSON.parse(tokenString);
      let accessToken = tokenObject.access;
      const refreshToken = tokenObject.refresh;
      const response = await fetch(
        `http://localhost:8000/api/friends/pending-requests/${sender}/${profileName}/accept/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      alert(data.msg || data.detail);
    } catch (error) {
      console.error(error);
      alert(error.msg || error.detail);
    }
  };

  const rejectRequest = async (sender, profileName) => {
    const tokenString = localStorage.getItem("token");
    try {
      const tokenObject = JSON.parse(tokenString);
      let accessToken = tokenObject.access;
      const refreshToken = tokenObject.refresh;
      const response = await fetch(
        `http://localhost:8000/api/friends/pending-requests/${sender}/${profileName}/reject/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      alert(data.msg || data.detail);
    } catch (error) {
      console.error(error);
      alert(error.msg || error.detail);
    }
  };

  return (
    <>
      {showNewPostForm && <Addnewpost onClose={handleCloseNewPostForm} />}
      <div className="w-full h-full bg-[#1e1e1e]">
        <div className="flex flex-no-wrap">
          {/* Sidebar starts */}
          <div className="absolute lg:relative w-64 h-screen shadow bg-[#f0f8ff] hidden lg:block">
            <div className="h-16 w-full flex items-center px-8">
              <h1 className="text-[#5F7DF2] text-xl font-bold">CONNECTIFY</h1>
            </div>
            <ul aria-orientation="vertical" className=" py-6">
              <li className="pl-6 cursor-pointer text-sm leading-3 tracking-normal pb-4 pt-5 text-indigo-700 focus:text-indigo-700 focus:outline-none">
                <div className="flex items-center">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-grid"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <rect x={4} y={4} width={6} height={6} rx={1} />
                      <rect x={14} y={4} width={6} height={6} rx={1} />
                      <rect x={4} y={14} width={6} height={6} rx={1} />
                      <rect x={14} y={14} width={6} height={6} rx={1} />
                    </svg>
                  </div>
                  <span className="ml-2">Feeds</span>
                </div>
              </li>
              <li
                onClick={togglePendingRequests}
                className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-4 mb-4 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none"
              >
                <div className="flex items-center">
                  <i className="ri-notification-line text-lg"></i>
                  <span className="ml-2">Notification</span>
                </div>
              </li>
              <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mb-4 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                <div className="flex items-center">
                  <i className="ri-search-2-line text-lg"></i>
                  <span className="ml-2">Search</span>
                </div>
              </li>
              <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                <div className="flex items-center">
                  <i className="ri-settings-2-line text-lg"></i>
                  <span className="ml-2">Settings</span>
                </div>
              </li>
            </ul>
          </div>
          {/*Mobile responsive sidebar*/}
          <div
            className={
              show
                ? "w-full h-full absolute z-40  transform  translate-x-0 "
                : "   w-full h-full absolute z-40  transform -translate-x-full"
            }
            id="mobile-nav"
          >
            <div
              className="bg-gray-800 opacity-50 absolute h-full w-full lg:hidden"
              onClick={() => setShow(!show)}
            />
            <div className="absolute z-40 sm:relative w-64 md:w-96 shadow pb-4 bg-gray-100 lg:hidden transition duration-150 ease-in-out h-full">
              <div className="flex flex-col justify-between h-full w-full">
                <div>
                  <div className="flex items-center justify-between px-8">
                    <div className="h-16 w-full flex items-center"></div>
                    <div
                      id="closeSideBar"
                      className="flex items-center justify-center h-10 w-10"
                      onClick={() => setShow(!show)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-x"
                        width={20}
                        height={20}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <line x1={18} y1={6} x2={6} y2={18} />
                        <line x1={6} y1={6} x2={18} y2={18} />
                      </svg>
                    </div>
                  </div>
                  <ul aria-orientation="vertical" className=" py-6">
                    <li className="pl-6 cursor-pointer text-sm leading-3 tracking-normal pb-4 pt-5 text-indigo-700 focus:text-indigo-700 focus:outline-none">
                      <div className="flex items-center">
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-grid"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <rect x={4} y={4} width={6} height={6} rx={1} />
                            <rect x={14} y={4} width={6} height={6} rx={1} />
                            <rect x={4} y={14} width={6} height={6} rx={1} />
                            <rect x={14} y={14} width={6} height={6} rx={1} />
                          </svg>
                        </div>
                        <span className="ml-2 xl:text-base md:text-2xl text-base">
                          Feeds
                        </span>
                      </div>
                    </li>
                    <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mt-4 mb-4 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                      <div className="flex items-center">
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          <i className="ri-notification-line text-lg"></i>
                        </div>
                        <span className="ml-2 xl:text-base md:text-2xl text-base">
                          Notification
                        </span>
                      </div>
                    </li>
                    <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal mb-4 py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                      <div className="flex items-center">
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          <i className="ri-search-2-line text-lg"></i>
                        </div>
                        <span className="ml-2 xl:text-base md:text-2xl text-base">
                          Search
                        </span>
                      </div>
                    </li>
                    <li className="pl-6 cursor-pointer text-gray-600 text-sm leading-3 tracking-normal py-2 hover:text-indigo-700 focus:text-indigo-700 focus:outline-none">
                      <div className="flex items-center">
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          <i className="ri-settings-2-line text-lg"></i>
                        </div>
                        <span className="ml-2 xl:text-base md:text-2xl text-base">
                          Setting
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="w-full">
                  <div className="border-t border-gray-300">
                    <div className="w-full flex items-center justify-between px-6 pt-1">
                      <div className="flex items-center">
                        <img
                          alt="profile-pic"
                          src={profileImg}
                          className="w-8 h-8 rounded-md"
                        />
                        <p className="md:text-xl text-gray-800 text-base leading-4 ml-2">
                          {profileName}
                        </p>
                      </div>
                      <ul className="flex">
                        <li className="cursor-pointer text-white pt-5 pb-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-messages"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            strokeWidth={1}
                            stroke="#718096"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
                            <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
                          </svg>
                        </li>
                        <li
                          className="cursor-pointer text-black pt-5 pb-3 pl-3"
                          onClick={handleNewPost}
                        >
                          <i className="ri-add-circle-fill text-2xl"></i>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar ends */}
          <div className="w-full">
            {/* Navigation starts */}
            <nav className="h-16 flex items-center lg:items-stretch justify-end lg:justify-between bg-[#f0f8ff] shadow relative z-10">
              <div className="hidden lg:flex w-full pr-6">
                <div className="w-1/2 h-full  lg:flex items-center pl-6 pr-24">
                  <input
                    type="text"
                    placeholder="Recipient Username"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                  <button onClick={sendFriendRequest}>Send Request</button>
                  <p>{message}</p>
                </div>
                <div className="w-1/2 hidden lg:flex">
                  <div className="w-full flex items-center pl-8 justify-end">
                    <div className="h-full w-20 flex items-center justify-center border-r border-l">
                      <div
                        className="relative cursor-pointer text-gray-600"
                        onClick={handleNewPost}
                      >
                        <i className="ri-add-circle-fill text-xl"></i>
                        {/* todo add new post */}
                        <div className="w-2 h-2 rounded-full bg-red-400 border border-white absolute inset-0 mt-1 mr-1 m-auto" />
                      </div>
                    </div>
                    <div className="h-full w-20 flex items-center justify-center border-r mr-4 cursor-pointer text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-messages"
                        width={28}
                        height={28}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
                        <path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
                      </svg>
                    </div>
                    <div
                      className="flex items-center relative cursor-pointer"
                      onClick={() => setProfile(!profile)}
                    >
                      <div className="rounded-full">
                        {profile ? (
                          <ul className="p-2 w-full border-r bg-white absolute rounded left-0 shadow mt-12 sm:mt-16 ">
                            <li className="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center">
                              <Link to="/profile">
                                <div className="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-user"
                                    width={18}
                                    height={18}
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <circle cx={12} cy={7} r={4} />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                                  </svg>
                                  <span className="text-sm ml-2">
                                    My Profile
                                  </span>
                                </div>
                              </Link>
                            </li>
                            <li className="flex w-full justify-between text-gray-600 hover:text-indigo-700 cursor-pointer items-center mt-2">
                              <div
                                className="flex items-center"
                                onClick={handleLogout}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon icon-tabler icon-tabler-logout"
                                  width={20}
                                  height={20}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path stroke="none" d="M0 0h24v24H0z" />
                                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                  <path d="M7 12h14l-3 -3m0 6l3 -3" />
                                </svg>
                                <Link to="/">
                                  <span className="text-sm ml-2">Sign out</span>
                                </Link>
                              </div>
                            </li>
                          </ul>
                        ) : (
                          ""
                        )}
                        <div className="relative">
                          <img
                            className="rounded-full h-10 w-10 object-cover"
                            src={profileImg}
                            alt="avatar"
                          />
                          <div className="w-2 h-2 rounded-full bg-green-400 border border-white absolute inset-0 mb-0 mr-0 m-auto" />
                        </div>
                      </div>
                      <p className="text-gray-800 text-sm mx-3">
                        {profileName}
                      </p>
                      <div className="cursor-pointer text-gray-600">
                        <svg
                          aria-haspopup="true"
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-chevron-down"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="text-gray-600 mr-8 visible lg:hidden relative"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  " "
                ) : (
                  <svg
                    aria-label="Main Menu"
                    aria-haspopup="true"
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-menu cursor-pointer"
                    width={30}
                    height={30}
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <line x1={4} y1={8} x2={20} y2={8} />
                    <line x1={4} y1={16} x2={20} y2={16} />
                  </svg>
                )}
              </div>
            </nav>
            {/* Navigation ends */}
            <div className="container py-10 md:w-4/5 w-11/12 relative">
              <div className="w-full h-full relative">
                <div className="story-main-container overflow-x-auto overflow-y-hidden whitespace-nowrap overscroll-x-contain absolute left-[20%] w-[60%]">
                  <Story />
                </div>
                <div className="feed-container absolute overflow-y-auto h-[68vh] bg-black border-solid border-white border-2 mt-[12%] left-[20%] w-[60%] p-3">
                  <Feeds />
                  <Feeds />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pending Requests Box */}
      {showPendingRequests && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
            {/* You can render your pending requests here */}
            <ul>
              {Array.isArray(requests) && requests.length > 0 ? (
                requests.map((request, index) => (
                  <>
                    <li key={index}>
                      {request.sender} - {request.created_at}
                    </li>
                    <div>
                      <button
                        onClick={() =>
                          acceptRequest(request.sender, profileName)
                        }
                        className="bg-green-500 px-4 py-1 rounded text-white mr-2"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          rejectRequest(request.sender, profileName)
                        }
                        className="bg-red-500 px-4 py-1 rounded text-white"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                ))
              ) : (
                <p>No pending requests</p>
              )}
            </ul>
            {/* For now, just an example close button */}
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={togglePendingRequests}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
