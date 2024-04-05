import React, { useState, useEffect } from "react";
import profileDefault from "../assets/profiledefault.png";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [bio, setBio] = useState("");
  const [profile_img, setProfile_img] = useState(profileDefault);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentsModal, setCommentsModal] = useState(false);
  const [selectedComments, setSelectedComments] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  const [editedBio, setEditedBio] = useState("");

  const [profileImage, setProfileImage] = useState(null); // State to hold the selected image file

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const openEditModal = () => {
    setIsEditModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const openPostModal = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closePostModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  const openCommentsModal = (comments) => {
    setSelectedComments(comments);
    setCommentsModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeCommentsModal = () => {
    setCommentsModal(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const tokenString = localStorage.getItem("token");
      try {
        const tokenObject = JSON.parse(tokenString);
        let accessToken = tokenObject.access;
        const refreshToken = tokenObject.refresh;

        const response = await fetch(
          "http://localhost:8000/api/user/profile/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 401) {
          // Unauthorized (Token expired)
          const refreshResponse = await fetch(
            "http://localhost:8000/api/user/token/refresh/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refresh: refreshToken,
              }),
            }
          );

          if (refreshResponse.ok) {
            const newTokens = await refreshResponse.json();
            accessToken = newTokens.access;
            localStorage.setItem(
              "token",
              JSON.stringify({
                access: accessToken,
                refresh: refreshToken,
              })
            );
          } else {
            throw new Error("Token refresh failed");
          }
        }

        const userDataResponse = await fetch(
          "http://localhost:8000/api/user/profile/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const userData = await userDataResponse.json();
        setUsername(userData.username);
        setFirst_name(userData.first_name);
        setLast_name(userData.last_name);
        setBio(userData.bio);
        if (userData.profile_img) {
          setProfile_img(`http://127.0.0.1:8000/${userData.profile_img}`);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }

      // Fetch user posts
      try {
        const tokenObject = JSON.parse(tokenString);
        let accessToken = tokenObject.access;
        const refreshToken = tokenObject.refresh;

        const postsResponse = await fetch(
          "http://localhost:8000/api/posts/my-posts/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData); // Set the fetched posts in state
          console.log(postsData);
        } else {
          console.error("Failed to fetch user posts");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    // Prepare the form data including the profile image
    const formData = new FormData();
    formData.append("first_name", editedFirstName || first_name);
    formData.append("last_name", editedLastName || last_name);
    formData.append("bio", editedBio || bio);
    if (profileImage) {
      formData.append("profile_img", profileImage || profile_img);
    }
    console.log("Form Data:", formData);
    const tokenString = localStorage.getItem("token");
    const tokenObject = JSON.parse(tokenString);
    const accessToken = tokenObject.access;

    try {
      const response = await fetch("http://localhost:8000/api/user/profile/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setFirst_name(updatedUserData.first_name);
        setLast_name(updatedUserData.last_name);
        setBio(updatedUserData.bio);
        if (updatedUserData.profile_img) {
          setProfile_img(
            `http://127.0.0.1:8000/${updatedUserData.profile_img}?${Date.now()}`
          );
        }
        console.log("Form Data:", formData);
        closeEditModal();
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDelete = async (postId) => {
    const tokenString = localStorage.getItem("token");
    const tokenObject = JSON.parse(tokenString);
    const accessToken = tokenObject.access;

    try {
      const response = await fetch(`http://localhost:8000/api/posts/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
        }),
      });

      if (response.ok) {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
        closePostModal();
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

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
              src={profile_img}
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
        <div className="dets flex flex-col gap-3 items-start justify-center px-6 mt-4 ml-[17vw]">
          <div className="flex gap-2">
            <h3 className="text-lg mb-1">{first_name}</h3>
            <h3 className="text-lg mb-1">{last_name}</h3>
          </div>
          <p className="text-xs tracking-tight opacity-50">{bio}</p>
          {/* <a className="px-3 py-2 bg-zinc-800 text-xs rounded-md" href="/edit">
            Edit Profile
          </a> */}
          <button
            className="px-3 py-2 bg-zinc-800 text-xs rounded-md"
            onClick={openEditModal}
          >
            Edit Profile
          </button>
        </div>

        {/* edit profile content */}
        <div
          className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center ${
            isEditModalOpen ? "" : "hidden"
          }`}
        >
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Profile Image
                </label>
                <input
                  type="file"
                  className="mt-1 p-2 w-full border rounded-md text-black"
                  onChange={handleImageChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md text-black"
                  placeholder={first_name}
                  value={editedFirstName}
                  onChange={(e) => setEditedFirstName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border rounded-md text-black"
                  value={editedLastName}
                  onChange={(e) => setEditedLastName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Bio
                </label>
                <textarea
                  className="mt-1 p-2 w-full border rounded-md text-black"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={closeEditModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>

        {/* edit profile content end */}

        {/* Post modal */}
        {selectedPost && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg relative">
              <button
                className="absolute top-0 right-2 text-3xl text-gray-900"
                onClick={closePostModal}
              >
                &times;
              </button>

              <img
                className="w-full h-[400px] object-cover mb-2"
                src={`http://127.0.0.1:8000/${selectedPost.content}`}
                alt={selectedPost.caption}
              />
              <p className="text-sm mb-4 text-black">{selectedPost.caption}</p>
              {/* Display comments, likes count, and delete button here */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="mr-2 text-black">
                    Likes: {selectedPost.total_likes}
                  </span>
                  <span className="text-black">
                    Comments: {selectedPost.comments.length}
                    {/* Display comments count */}
                    <div className="mb-4">
                      <button
                        className="text-blue-500"
                        onClick={() => openCommentsModal(selectedPost.comments)}
                      >
                        View Comments {selectedPost.comments.length}
                      </button>
                    </div>
                  </span>
                </div>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(selectedPost.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Comments modal */}
        {commentsModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg relative overflow-y-scroll max-h-[400px]">
              <button
                className="absolute top-0 right-2 text-3xl text-gray-900"
                onClick={closeCommentsModal}
              >
                &times;
              </button>
              <h2 className="text-lg font-semibold mb-4 text-black">
                Comments
              </h2>
              {selectedComments.map((comment, index) => (
                <div key={index} className="mb-2">
                  <p className="text-xs text-black">{comment.user}</p>
                  <p className="text-sm mb-1 text-black">{comment.text}</p>
                  <p className="text-sm mb-1 text-black">
                    {comment.created_at}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* display post */}
        <div className="posts w-full gap-3 py-2 mt-5 px-10 flex-wrap overflow-hidden flex items-center justify-center">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="post w-[200px] h-[200px] cursor-pointer bg-sky-100 overflow-hidden"
                onClick={() => openPostModal(post)}
              >
                <img
                  className="w-full h-full object-cover"
                  src={`http://127.0.0.1:8000/${post.content}`}
                  alt={post.caption}
                />
              </div>
            ))
          ) : (
            <p>{posts.msg || "You have not posted yet !"}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
