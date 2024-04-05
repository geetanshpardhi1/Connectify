import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewPostForm = ({ onClose }) => {
    const navigate = useNavigate();
    const [caption, setCaption] = useState("");
    const [media, setMedia] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const tokenString = localStorage.getItem("token");
    
        if (!tokenString) {
            navigate("/");
            return;
        }
    
        const tokenObject = JSON.parse(tokenString);
        let accessToken = tokenObject.access;
    
        const formData = new FormData();
        formData.append('content', media);
        formData.append('caption', caption);
    
        fetch("http://localhost:8000/api/posts/create/", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to create post");
            }
        })
        .then((data) => {
            console.log(data);
            setCaption("");
            setMedia("");
            onClose();
        })
        .catch((error) => {
            console.error("Error:", error);
            navigate("/");
        });
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg w-96">
                <h2 className="text-xl font-semibold mb-4">New Post</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        className="mt-1 p-2 w-full border rounded-md text-black"
                        onChange={(e) => setMedia(e.target.files[0])}
                        required
                    />
                    <textarea
                        className="w-full p-2 border rounded-md mb-4"
                        placeholder="What's on your mind?"
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewPostForm;
