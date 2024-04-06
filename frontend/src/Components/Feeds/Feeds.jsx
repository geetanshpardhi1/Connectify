import React, { useState } from "react";
import defaultProfile from "../../assets/profiledefault.png";
import cy1 from "../../assets/cy1.png";

const Feeds = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      profileName: "User1",
      profileImage: defaultProfile,
      image: cy1,
      likes: 23,
      comments: 5,
      caption: "Caption for post 1"
    },
    {
      id: 2,
      profileName: "User2",
      profileImage: defaultProfile,
      image: cy1,
      likes: 15,
      comments: 3,
      caption: "Caption for post 2"
    }
    // Add more posts as needed
  ]);

  const handleLike = (id) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (id) => {
    // Add comment functionality here
    console.log(`Comment on post ${id}`);
  };

  return (
    <>
      {posts.map((post) => (
        <div key={post.id} className="feed relative flex flex-col items-start justify-center mb-3">
          <div className="profileName flex gap-3 items-center justify-start">
            <img
              alt="Uploaded"
              width={"50px"}
              height={"50px"}
              className="rounded-circle"
              src={post.profileImage}
            />
            <h2 className="text-white font-bold">{post.profileName}</h2>
          </div>
          <div className="feedContent h-full w-full flex items-center justify-center">
            <img width={"60%"} src={post.image} alt="" />
          </div>
          <div className="like-com flex items-center gap-2 text-white">
            <div className="like flex items-center gap-2 text-white" onClick={() => handleLike(post.id)}>
              <i className="ri-heart-line"></i>
              <p>{post.likes}</p>
            </div>
            <div className="comment flex items-center gap-2 text-white" onClick={() => handleComment(post.id)}>
              <i className="ri-chat-1-fill"></i>
              <p>{post.comments}</p>
            </div>
          </div>
          <div className="caption flex items-center gap-3">
            <h2 className="text-white font-bold">{post.profileName}</h2>
            <p className="text-white">{post.caption}</p>
          </div>
          <div className="bottomline bg-white h-[2px] w-full opacity-[0.2] mt-3"></div>
        </div>
      ))}
    </>
  );
};

export default Feeds;
