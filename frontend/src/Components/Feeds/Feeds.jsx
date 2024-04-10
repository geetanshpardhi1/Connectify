import React, { useState, useEffect } from "react";
import defaultProfile from "../../assets/profiledefault.png";

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentBoxOpen, setCommentBoxOpen] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenString = localStorage.getItem("token");
        const tokenObject = JSON.parse(tokenString);
        const accessToken = tokenObject.access;

        const response = await fetch(
          "http://127.0.0.1:8000/api/posts/friends-posts/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Fetched posts:", data); // Debugging log
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  const handleLike = async (id, isLiked) => {
    try {
      const tokenString = localStorage.getItem("token");
      const tokenObject = JSON.parse(tokenString);
      const accessToken = tokenObject.access;


      const response = await fetch(
        `http://127.0.0.1:8000/api/posts/like-post/`,
        {
          method : "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id
            ? {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !isLiked,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const toggleCommentBox = (id) => {
    setCommentBoxOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleComment = async (id, commentContent) => {
    try {
      const tokenString = localStorage.getItem("token");
      const tokenObject = JSON.parse(tokenString);
      const accessToken = tokenObject.access;

      const response = await fetch(
        `http://127.0.0.1:8000/api/posts/comment-post/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: id,
            text: commentContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const newComment = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, comments: [...post.comments, newComment] } : post
        )
      );

      setCommentContent(""); // Clear the input field after adding comment
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <>
      {posts.map((post, index) => (
        <div
        key={`${post.user}-${index}`}
          className="feed relative flex flex-col items-start justify-center mb-3"
        >
          <div className="profileName flex gap-3 items-center justify-start">
            <img
              alt="Uploaded"
              width={"50px"}
              height={"50px"}
              className="rounded-circle"
              src={
                post.profile_img
                  ? `http://127.0.0.1:8000/${post.profile_img}`
                  : defaultProfile
              }
            />
            <h2 className="text-white font-bold">{post.user}</h2>
          </div>
          <div className="feedContent h-full w-full flex items-center justify-center">
            <img width={"60%"} src={`http://127.0.0.1:8000/${post.content}`} alt="" />
          </div>
          <div className="like-com flex items-center gap-2 text-white">
            <div
              className="like flex items-center gap-2 text-white"
              onClick={() => handleLike(post.id, post.isLiked)}
            >
              <i
                className={`ri-heart-line ${
                  post.isLiked ? "text-red-500" : "text-gray-500"
                }`}
              ></i>
              <p>{post.likes.length}</p>
            </div>

            <div
              className="comment flex items-center gap-2 text-white"
              onClick={() => toggleCommentBox(post.id)}
            >
              <i className="ri-chat-1-fill"></i>
              <p>{post.comments.length}</p>
            </div>
          </div>
          <div className="caption flex items-center gap-3">
            <h2 className="text-white font-bold">{post.user}</h2>
            <p className="text-white">{post.caption}</p>
          </div>

          {/* Comment section */}
          {commentBoxOpen[post.id] && (
            <div className="comment-section mt-3">
              {/* Display previous comments */}
              {post.comments.map((comment, idx) => (
                <div key={idx} className="previous-comment text-white">
                  <strong>{comment.user}:</strong> {comment.text}
                </div>
              ))}

              {/* Add new comment */}
              <input
                type="text"
                placeholder="Add a comment..."
                className="border rounded-md p-2 w-full mt-2"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                onClick={() => handleComment(post.id, commentContent)}
              >
                Comment
              </button>
            </div>
          )}

          <div className="bottomline bg-white h-[2px] w-full opacity-[0.2] mt-3"></div>
        </div>
      ))}
    </>
  );
};

export default Feeds;
