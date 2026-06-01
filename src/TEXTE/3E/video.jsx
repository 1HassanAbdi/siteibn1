import React from "react";

const VideoPlayer = () => {
  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
        
        <iframe
          src="https://drive.google.com/file/d/142I-Iu8tLWy37j8uO5l0FEqgY2B5JkYG9JLOCOSqv0w/preview"
          width="100%"
          height="100%"
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Video Player"
          className="w-full h-full border-0"
        ></iframe>

      </div>
    </div>
  );
};

export default VideoPlayer;