import React from "react";
import defaultProfile from "../../assets/profiledefault.png";
import cy1 from "../../assets/cy1.png";
const Feeds = () => {
  return (
    <>
      <div className="feed relative flex flex-col items-start justify-center mb-3">
        <div className="profileName flex gap-3 items-center justify-start">
          <img
            alt="Uploaded"
            width={"50px"}
            height={"50px"}
            className="rounded-circle"
            src={defaultProfile}
          />
          <h2 className="text-white font-bold">Profile name</h2>
        </div>
        <div className="feedContent h-full w-full flex items-center justify-center">
          <img width={"60%"} src={cy1} alt="" />
        </div>
        <div className="like-com flex items-center gap-2 text-white">
          <div className="like flex items-center gap-2 text-white">
            <i class="ri-heart-line"></i>
            <p>23</p>
          </div>
          <div className="comment flex items-center gap-2 text-white">
            <i class="ri-chat-1-fill"></i>
            <p>5</p>
          </div>
        </div>
        <div className="caption flex items-center gap-3">
          <h2 className="text-white font-bold">Profile name</h2>
          <p className="text-white">caption</p>
        </div>
        <div className="bottomline bg-white h-[2px] w-full opacity-[0.2] mt-3"></div>
      </div>
    </>
  );
};

export default Feeds;
