import React, { useState ,useEffect } from "react";
import profileDefault from "../assets/profiledefault.png"

const Profile = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const tokenString = localStorage.getItem("token");
      try {
        const tokenObject = JSON.parse(tokenString);
        let accessToken = tokenObject.access;
        const refreshToken = tokenObject.refresh;

        const response = await fetch("http://localhost:8000/api/user/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401) { // Unauthorized (Token expired)
          const refreshResponse = await fetch("http://localhost:8000/api/user/token/refresh/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              refresh: refreshToken,
            }),
          });

          if (refreshResponse.ok) {
            const newTokens = await refreshResponse.json();
            accessToken = newTokens.access;
            localStorage.setItem("token", JSON.stringify({
              access: accessToken,
              refresh: refreshToken,
            }));
          } else {
            throw new Error("Token refresh failed");
          }
        }

        const userDataResponse = await fetch("http://localhost:8000/api/user/profile/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userData = await userDataResponse.json();
        setUsername(userData.username);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      <div className="w-full min-h-screen bg-zinc-900 text-white py-5">
        <div className="nav flex justify-around items-center px-4">
          <h3 className="text-lg">{username}</h3>
          <div className="icons flex gap-5">
            <a href="/upload">
              <i className="text-[1.4rem] ri-add-box-line"></i>
            </a>
            <i className="text-[1.4rem] ri-menu-line"></i>
          </div>
        </div>
        <div className="flex justify-around items-center px-4 mt-8">
          <div className="w-[19vw] h-[19vw] bg-sky-100 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={profileDefault}
              alt=""
            />
          </div>
          <div className="stats flex gap-5 items-center justify-between">
            <div className="flex flex-col items-center justify-center">
              <h3>322</h3>
              <h4>Posts</h4>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3>3122</h3>
              <h4>Followers</h4>
            </div>
            <div className="flex flex-col items-center justify-center">
              <h3>582</h3>
              <h4>Following</h4>
            </div>
          </div>
        </div>
        <div className="dets flex gap-6 items-center justify-start px-6 mt-4 ml-[17vw]">
          <h3 className="text-lg mb-1">{username}</h3>
          <p className="text-xs tracking-tight opacity-50">bio</p>
          <a className="px-3 py-2 bg-zinc-800 text-xs rounded-md" href="/edit">
            Edit Profile
          </a>
        </div>
        <div className="posts w-full gap-1 py-2 mt-5 px-10 flex-wrap overflow-hidden flex items-center justify-center">
          <div className="post h-32 bg-sky-100 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={profileDefault}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
