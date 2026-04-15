import React, { useState } from "react";


export default function ReelChoice() {
  const [isToggled1, setIsToggled1] = useState(false);
  const [isToggled2, setIsToggled2] = useState(false);
  const videoData = [
    // Just placeholder data for now, replace with actual API data when available
    {src: "src/assets/video.mp4", title: "Video 1", id: 1},
    {src: "src/assets/video.mp4", title: "Video 2", id: 2},
    {src: "src/assets/video.mp4", title: "Video 3", id: 3},
    {src: "src/assets/video.mp4", title: "Video 4", id: 4},
    {src: "src/assets/video.mp4", title: "Video 5", id: 5},
    {src: "src/assets/video.mp4", title: "Video 6", id: 6},
    {src: "src/assets/video.mp4", title: "Video 7", id: 7},
    {src: "src/assets/video.mp4", title: "Video 8", id: 8},
    {src: "src/assets/video.mp4", title: "Video 9", id: 9},
    
  ]; // This will hold the video data fetched from the API

  return (
    <div className="flex">
      <div className="w-3/5">
        {/* <div className="">Reelchoice</div> */}
        <h1>My Reels and Posters</h1>
        <h2>Scheduled videos and posters:</h2>
        <div className="w-full max-h-140 overflow-y-auto border border-slate-200 rounded-xl p-4 m-4">
          <ul className="w-full h-auto flex gap-4 flex-wrap justify-center px-2 py-2">
            {videoData.map((video) => (
              <li className="w-40" key={video.id}>
                <video src={video.src} title={video.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-2/5">
        <h2 className="p-2 m-4">Current Reel/Poster:</h2>
        <div className="w-full h-auto p-2 m-4 flex justify-center items-center">
          <video className="w-50 px-1 py-1" src="src/assets/video.mp4" title="Current Reel" controls />
        </div>
        <label className="inline-flex items-center cursor-pointer p-2 m-4 w-full">
          <span className="ml-3 text-sm font-medium text-gray-900 w-8/10">
            Use default Reels
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={isToggled1}
            onChange={() => setIsToggled1(!isToggled1)}
          />
          <div className={`relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full ${
            isToggled1 ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
              isToggled1 ? 'translate-x-4' : 'translate-x-0'
            }`}></span>
          </div>
        </label>
        <label className="inline-flex items-center cursor-pointer p-2 m-4 w-full">
          <span className="ml-3 text-sm font-medium text-gray-900 w-8/10">
            Use default Configuration
          </span>
          <input
            type="checkbox"
            className="sr-only"
            checked={isToggled2}
            onChange={() => setIsToggled2(!isToggled2)}
          />
          <div className={`relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full ${
            isToggled2 ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
              isToggled2 ? 'translate-x-4' : 'translate-x-0'
            }`}></span>
          </div>
        </label>
      </div>
    </div>

  );
}
