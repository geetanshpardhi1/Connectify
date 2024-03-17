import React from "react";
import "./story.css";
import defaultProfile from "../../assets/profiledefault.png";
const StoryItem = () => {
  return (
    <>
      <div className="img-container">
        <img src={defaultProfile} alt="" />
      </div>
    </>
  );
};

export default StoryItem;
